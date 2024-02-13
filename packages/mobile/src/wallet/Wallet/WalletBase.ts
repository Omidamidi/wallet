import { TonAPI } from '@tonkeeper/core/src/TonAPI';
import {
  WalletAddress,
  WalletConfig,
  WalletContractVersion,
  WalletNetwork,
  WalletType,
} from '../WalletTypes';
import { Address, AddressesByVersion } from '@tonkeeper/core/src/formatters/Address';
import {
  createBatteryApiInstance,
  createSseInstance,
  createTonApiInstance,
  createTronApiInstance,
} from '../utils';
import { BatteryAPI } from '@tonkeeper/core/src/BatteryAPI';
import {
  ContractService,
  ServerSentEvents,
  Storage,
  TronAPI,
  WalletVersion,
} from '@tonkeeper/core';
import { signProofForTonkeeper } from '@tonkeeper/core/src/utils/tonProof';
import { storeStateInit } from '@ton/ton';
import nacl from 'tweetnacl';
import { beginCell } from '@ton/core';
import { TronService } from '@tonkeeper/core/src/TronService';
import { NamespacedLogger, logger } from '$logger';

export class WalletBase {
  public identifier: string;
  public pubkey: string;
  public address: WalletAddress;

  public tronService: TronService;

  public tonapi: TonAPI;
  protected batteryapi: BatteryAPI;
  protected tronapi: TronAPI;
  protected sse: ServerSentEvents;

  private tonProofStorageKey: string;

  protected logger: NamespacedLogger;

  constructor(
    public config: WalletConfig,
    public tonAllAddresses: AddressesByVersion,
    protected storage: Storage,
  ) {
    this.identifier = config.identifier;
    this.pubkey = config.pubkey;

    const tonAddress = Address.parse(this.tonAllAddresses[config.version].raw, {
      bounceable: false,
    }).toAll({
      testOnly: config.network === WalletNetwork.testnet,
    });

    this.address = {
      tron: { proxy: '', owner: '' },
      ton: tonAddress,
    };

    this.logger = logger.extend(`Wallet ${this.address.ton.short}`);

    this.tonapi = createTonApiInstance(this.isTestnet);
    this.batteryapi = createBatteryApiInstance(this.isTestnet);
    this.tronapi = createTronApiInstance(this.isTestnet);
    this.sse = createSseInstance(this.isTestnet);

    this.tronService = new TronService(this.address, this.tronapi);

    this.tonProofStorageKey = `${this.address.ton.raw}/tonProof`;
  }

  public setConfig(config: WalletConfig) {
    this.config = config;
  }

  public isV4() {
    return this.config.version === WalletContractVersion.v4R2;
  }

  public get isLockup() {
    return this.config.version === WalletContractVersion.LockupV1;
  }

  public get isTestnet() {
    return this.config.network === WalletNetwork.testnet;
  }

  public get isWatchOnly() {
    return this.config.type === WalletType.WatchOnly;
  }

  public getLockupConfig() {
    return {
      wallet_type: this.config.version,
      workchain: this.config.workchain,
      config_pubkey: this.config.configPubKey,
      allowed_destinations: this.config.allowedDestinations,
    };
  }

  public async getWalletInfo() {
    return await this.tonapi.accounts.getAccount(this.address.ton.raw);
  }

  protected async rehydrate() {}
}