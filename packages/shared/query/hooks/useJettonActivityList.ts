import { useExternalState } from '../../hooks/useExternalState';
import { tk } from '../../tonkeeper';
import { useEffect } from 'react';

export const useJettonActivityList = (jettonId: string) => {
  if (!tk.wallet) {
    return {
      loadMore: () => {},
      reload: () => {},
      isReloading: false,
      isLoading: false,
      sections: [],
      hasMore: false,
    }
  }
  
  const state = useExternalState(tk.wallet?.jettonActivityList.state);

  useEffect(() => {
    tk.wallet.jettonActivityList.load(jettonId);
  }, []);

  return {
    loadMore: () => tk.wallet?.jettonActivityList.loadMore(jettonId),
    reload: () => tk.wallet?.jettonActivityList.reload(jettonId),
    isReloading: state.isReloading,
    isLoading: state.isLoading,
    sections: state.sections,
    hasMore: state.hasMore,
  };
};