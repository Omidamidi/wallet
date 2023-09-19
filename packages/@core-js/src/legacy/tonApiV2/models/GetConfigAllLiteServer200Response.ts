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
 * @interface GetConfigAllLiteServer200Response
 */
export interface GetConfigAllLiteServer200Response {
    /**
     * 
     * @type {number}
     * @memberof GetConfigAllLiteServer200Response
     */
    mode: number;
    /**
     * 
     * @type {BlockRaw}
     * @memberof GetConfigAllLiteServer200Response
     */
    id: BlockRaw;
    /**
     * 
     * @type {string}
     * @memberof GetConfigAllLiteServer200Response
     */
    stateProof: string;
    /**
     * 
     * @type {string}
     * @memberof GetConfigAllLiteServer200Response
     */
    configProof: string;
}

/**
 * Check if a given object implements the GetConfigAllLiteServer200Response interface.
 */
export function instanceOfGetConfigAllLiteServer200Response(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "mode" in value;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "stateProof" in value;
    isInstance = isInstance && "configProof" in value;

    return isInstance;
}

export function GetConfigAllLiteServer200ResponseFromJSON(json: any): GetConfigAllLiteServer200Response {
    return GetConfigAllLiteServer200ResponseFromJSONTyped(json, false);
}

export function GetConfigAllLiteServer200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetConfigAllLiteServer200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'mode': json['mode'],
        'id': BlockRawFromJSON(json['id']),
        'stateProof': json['state_proof'],
        'configProof': json['config_proof'],
    };
}

export function GetConfigAllLiteServer200ResponseToJSON(value?: GetConfigAllLiteServer200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'mode': value.mode,
        'id': BlockRawToJSON(value.id),
        'state_proof': value.stateProof,
        'config_proof': value.configProof,
    };
}
