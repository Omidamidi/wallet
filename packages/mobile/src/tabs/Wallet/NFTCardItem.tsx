import { useTranslator } from '$hooks';
import { openNFT } from '$navigation';
import { DarkTheme } from '$styles';
import { Steezy } from '$styles';
import { View, Text, Icon, Pressable } from '$uikit';
import { checkIsTonDiamondsNFT, maskifyTonAddress, ns } from '$utils';
import { useFlags } from '$utils/flags';
import _ from 'lodash';
import React, { memo, useCallback, useMemo } from 'react';
import * as S from '../../core/NFTs/NFTItem/NFTItem.style';
import { useExpiringDomains } from '$store/zustand/domains/useExpiringDomains';
import { Address } from '$libs/Ton';

interface NFTCardItemProps {
  item: any;
  onPress?: () => void;
}

export const NFTCardItem = memo<NFTCardItemProps>((props) => {
  const { item } = props;

  const flags = useFlags(['disable_apperance']);
  const t = useTranslator();

  const expiringDomains = useExpiringDomains((state) => state.domains);

  console.log(expiringDomains);

  const isTonDiamondsNft = checkIsTonDiamondsNFT(item);
  const isOnSale = useMemo(() => !!item.sale, [item.sale]);
  const isTG = (item.dns || item.name)?.endsWith('.t.me');
  const isDNS = !!item.dns && !isTG;
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOpenNftItem = useCallback(
    _.throttle(() => openNFT({ currency: item.currency, address: item.address }), 1000),
    [item],
  );

  const title = useMemo(() => {
    if (isDNS) {
      return item.dns;
    }

    return item.name || maskifyTonAddress(item.address);
  }, [isDNS, item.dns, item.name, item.address]);

  const nftRawAddress = useMemo(() => new Address(item.address).format({ raw: true }), []);

  return (
    <Pressable
      underlayColor={DarkTheme.backgroundContentTint}
      backgroundColor={DarkTheme.backgroundContent}
      style={styles.container}
      onPress={handleOpenNftItem}
    >
      <S.SmallImage
        source={{
          uri: item.content.image.baseUrl,
        }}
      >
        <S.OnSaleBadge>
          {isOnSale && <Icon name="ic-sale-badge-32" colorless />}
        </S.OnSaleBadge>
        <S.Badges>
          {isTonDiamondsNft && !flags.disable_apperance ? (
            <S.AppearanceBadge>
              <Icon name="ic-appearance-16" color="constantLight" />
            </S.AppearanceBadge>
          ) : null}
        </S.Badges>
        {expiringDomains[nftRawAddress] && (
          <S.FireBadge>
            <Icon name="ic-fire-badge-32" colorless />
          </S.FireBadge>
        )}
      </S.SmallImage>
      <View style={styles.info}>
        <Text variant="label2" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="body3" color="textSecondary" numberOfLines={1}>
          {isDNS
            ? 'TON DNS'
            : item?.collection
            ? item.collection.name || t('nft_unnamed_collection')
            : t('nft_single_nft')}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = Steezy.create(({ colors, corners }) => ({
  container: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: colors.backgroundContent,
    borderRadius: corners.medium,
    overflow: 'hidden',
  },
  info: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
}));
