/* tslint:disable */
/* eslint-disable */
/**
 * REST api to TON blockchain explorer
 * Provide access to indexed TON blockchain
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: support@tonkeeper.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { BlockRaw } from './BlockRaw';
import {
    BlockRawFromJSON,
    BlockRawFromJSONTyped,
    BlockRawToJSON,
} from './BlockRaw';

/**
 * 
 * @export
 * @interface GetAccountStateLiteServer200Response
 */
export interface GetAccountStateLiteServer200Response {
    /**
     * 
     * @type {BlockRaw}
     * @memberof GetAccountStateLiteServer200Response
     */
    id: BlockRaw;
    /**
     * 
     * @type {BlockRaw}
     * @memberof GetAccountStateLiteServer200Response
     */
    shardblk: BlockRaw;
    /**
     * 
     * @type {string}
     * @memberof GetAccountStateLiteServer200Response
     */
    shardProof: string;
    /**
     * 
     * @type {string}
     * @memberof GetAccountStateLiteServer200Response
     */
    proof: string;
    /**
     * 
     * @type {string}
     * @memberof GetAccountStateLiteServer200Response
     */
    state: string;
}

/**
 * Check if a given object implements the GetAccountStateLiteServer200Response interface.
 */
export function instanceOfGetAccountStateLiteServer200Response(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "shardblk" in value;
    isInstance = isInstance && "shardProof" in value;
    isInstance = isInstance && "proof" in value;
    isInstance = isInstance && "state" in value;

    return isInstance;
}

export function GetAccountStateLiteServer200ResponseFromJSON(json: any): GetAccountStateLiteServer200Response {
    return GetAccountStateLiteServer200ResponseFromJSONTyped(json, false);
}

export function GetAccountStateLiteServer200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetAccountStateLiteServer200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': BlockRawFromJSON(json['id']),
        'shardblk': BlockRawFromJSON(json['shardblk']),
        'shardProof': json['shard_proof'],
        'proof': json['proof'],
        'state': json['state'],
    };
}

export function GetAccountStateLiteServer200ResponseToJSON(value?: GetAccountStateLiteServer200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': BlockRawToJSON(value.id),
        'shardblk': BlockRawToJSON(value.shardblk),
        'shard_proof': value.shardProof,
        'proof': value.proof,
        'state': value.state,
    };
}
