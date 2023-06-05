import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useBottomTabBarHeight } from '$hooks/useBottomTabBarHeight';
import { useNetInfo } from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';

import * as S from '../../core/Balances/Balances.style';
import {
  Button,
  Icon,
  List,
  Loader,
  Screen,
  ScrollHandler,
  Spacer,
  Text,
  View,
} from '$uikit';
import {
  useAppStateActive,
  usePrevious,
  useJettonBalances,
  useTheme,
  useTranslator,
} from '$hooks';
import { walletActions, walletSelector } from '$store/wallet';
import { ns } from '$utils';
import {
  CryptoCurrencies,
  NavBarHeight,
  SecondaryCryptoCurrencies,
  TabletMaxWidth,
} from '$shared/constants';
import { openNotificationsScreen, openRequireWalletModal } from '$navigation';
import { eventsActions, eventsSelector } from '$store/events';
import { mainActions } from '$store/main';
import { LargeNavBarInteractiveDistance } from '$uikit/LargeNavBar/LargeNavBar';
import { getLastRefreshedAt } from '$database';
import { TransactionsList } from '$core/Balances/TransactionsList/TransactionsList';
import { useNavigation } from '$libs/navigation';
import { useNotificationsStore } from '$store/zustand/notifications/useNotificationsStore';
import { Steezy } from '$styles';
import { Notification } from '$core/Notifications/Notification';

export const ActivityScreen: FC = () => {
  const nav = useNavigation();
  const t = useTranslator();
  const dispatch = useDispatch();
  const theme = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const { currencies, isRefreshing, isLoaded, balances, wallet, oldWalletBalances } =
    useSelector(walletSelector);
  const {
    isLoading: isEventsLoading,
    eventsInfo,
    canLoadMore,
  } = useSelector(eventsSelector);
  const notifications = useNotificationsStore((state) => state.notifications);

  const netInfo = useNetInfo();
  const prevNetInfo = usePrevious(netInfo);

  const { enabled: jettonBalances } = useJettonBalances();
  const isFocused = useIsFocused();

  const isEventsLoadingMore = !isRefreshing && isEventsLoading && !!wallet;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(mainActions.mainStackInited());
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useAppStateActive(() => {
    dispatch(mainActions.getTimeSynced());
    getLastRefreshedAt().then((ts) => {
      if (Date.now() - ts > 60 * 1000) {
        dispatch(walletActions.refreshBalancesPage());
      }
    });
  });

  const handleRefresh = useCallback(() => {
    dispatch(walletActions.refreshBalancesPage(true));
  }, [dispatch]);

  const handleOpenNotificationsScreen = useCallback(() => {
    openNotificationsScreen();
  }, []);

  const otherCurrencies = useMemo(() => {
    const list = [...SecondaryCryptoCurrencies];
    if (wallet && wallet.ton.isLockup()) {
      list.unshift(CryptoCurrencies.TonRestricted, CryptoCurrencies.TonLocked);
    }

    return list.filter((item) => {
      if (item === CryptoCurrencies.Ton) {
        return false;
      }

      if (
        [CryptoCurrencies.TonLocked, CryptoCurrencies.TonRestricted].indexOf(item) > -1
      ) {
        return true;
      }

      if (+balances[item] > 0) {
        return true;
      }

      return currencies.indexOf(item) > -1;
    });
  }, [currencies, balances, wallet]);

  const initialData = useMemo(() => {
    const result: {
      isFirst?: boolean;
      title?: string;
      data: any;
      footer?: React.ReactElement;
    }[] = [];
    return result;
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isEventsLoading || !canLoadMore) {
      return;
    }

    dispatch(eventsActions.loadEvents({ isLoadMore: true }));
  }, [dispatch, isEventsLoading, canLoadMore]);

  const renderNotificationsHeader = useCallback(() => {
    return (
      <View style={styles.notificationsHeader}>
        <Spacer y={12} />
        {notifications.slice(0, 2).map((notification) => (
          <Notification notification={notification} key={notification.received_at} />
        ))}
        <List style={styles.listStyle.static}>
          <List.Item
            leftContent={
              <View style={styles.iconContainer}>
                <Icon name={'ic-bell-28'} color={'iconSecondary'} />
              </View>
            }
            onPress={handleOpenNotificationsScreen}
            title={'Notifications'}
            subtitle={'From connected services'}
            chevron
          />
        </List>
      </View>
    );
  }, [notifications]);

  function renderFooter() {
    return (
      <>
        {isEventsLoadingMore ? (
          <S.LoaderMoreWrap>
            <Loader size="medium" />
          </S.LoaderMoreWrap>
        ) : null}
        {!wallet && <S.CreateWalletButtonHelper />}
        <View style={{ height: LargeNavBarInteractiveDistance }} />
        <S.BottomSpace />
      </>
    );
  }

  function renderContent() {
    if (!isLoaded) {
      return (
        <S.LoaderWrap style={{ paddingBottom: tabBarHeight }}>
          <Loader size="medium" />
        </S.LoaderWrap>
      );
    }

    return (
      <TransactionsList
        renderHeader={renderNotificationsHeader}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefresh}
            refreshing={isRefreshing && isFocused}
            tintColor={theme.colors.foregroundPrimary}
            progressBackgroundColor={theme.colors.foregroundPrimary}
          />
        }
        eventsInfo={eventsInfo}
        initialData={initialData}
        renderFooter={renderFooter}
        onEndReached={isEventsLoading || !canLoadMore ? undefined : handleLoadMore}
        contentContainerStyle={{
          width: '100%',
          maxWidth: ns(TabletMaxWidth),
          alignSelf: 'center',
          paddingTop: ns(NavBarHeight) + ns(4),
          paddingHorizontal: ns(16),
          paddingBottom: tabBarHeight - ns(20),
        }}
      />
    );
  }

  useEffect(() => {
    if (netInfo.isConnected && prevNetInfo.isConnected === false) {
      dispatch(mainActions.dismissBadHosts());
      handleRefresh();
    }
  }, [netInfo.isConnected, prevNetInfo.isConnected, handleRefresh, dispatch]);

  const handlePressRecevie = React.useCallback(() => {
    if (wallet) {
      nav.go('Receive', {
        currency: 'ton',
        isFromMainScreen: true,
      });
    } else {
      openRequireWalletModal();
    }
  }, [wallet]);

  const handlePressBuy = React.useCallback(() => {
    if (wallet) {
      nav.openModal('Exchange', { category: 'buy' });
    } else {
      openRequireWalletModal();
    }
  }, [wallet]);

  if (isLoaded && (!wallet || Object.keys(eventsInfo).length < 1)) {
    return (
      <Screen>
        <View style={styles.emptyContainer}>
          <Text variant="h2" style={{ textAlign: 'center', marginBottom: ns(4) }}>
            {t('activity.empty_transaction_title')}
          </Text>
          <Text variant="body1" color="textSecondary">
            {t('activity.empty_transaction_caption')}
          </Text>

          <View style={styles.emptyButtons}>
            <Button
              style={{ marginRight: ns(12) }}
              onPress={handlePressBuy}
              size="medium_rounded"
              mode="secondary"
            >
              {t('activity.buy_toncoin_btn')}
            </Button>
            <Button onPress={handlePressRecevie} size="medium_rounded" mode="secondary">
              {t('activity.receive_btn')}
            </Button>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <S.Wrap>
      <ScrollHandler navBarTitle={t('activity.screen_title')}>
        {renderContent()}
      </ScrollHandler>
    </S.Wrap>
  );
};

const styles = Steezy.create(({ colors }) => ({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  emptyButtons: {
    flexDirection: 'row',
    marginTop: ns(24),
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundContentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationsHeader: {
    marginHorizontal: -16,
  },
  listStyle: {
    marginBottom: 8,
  },
}));
