/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ImmutableNetwork } from '../../credentials/ImmutableNetwork.credentials';
import { ImmutableApi } from '../../credentials/ImmutableApi.credentials';
import { ImmutablePassport } from '../../credentials/ImmutablePassport.credentials';

describe('Credentials', () => {
  describe('ImmutableNetwork', () => {
    let credentials: ImmutableNetwork;

    beforeEach(() => {
      credentials = new ImmutableNetwork();
    });

    it('should have correct name', () => {
      expect(credentials.name).toBe('immutableNetwork');
    });

    it('should have correct display name', () => {
      expect(credentials.displayName).toBe('Immutable Network');
    });

    it('should have network property', () => {
      const networkProp = credentials.properties.find(p => p.name === 'network');
      expect(networkProp).toBeDefined();
      expect(networkProp?.type).toBe('options');
    });

    it('should support all networks', () => {
      const networkProp = credentials.properties.find(p => p.name === 'network');
      const options = networkProp?.options as Array<{ value: string }>;
      const networkValues = options?.map(o => o.value) || [];

      expect(networkValues).toContain('zkevmMainnet');
      expect(networkValues).toContain('zkevmTestnet');
      expect(networkValues).toContain('imxMainnet');
      expect(networkValues).toContain('imxTestnet');
    });

    it('should have API key property', () => {
      const apiKeyProp = credentials.properties.find(p => p.name === 'apiKey');
      expect(apiKeyProp).toBeDefined();
      expect(apiKeyProp?.type).toBe('string');
      expect(apiKeyProp?.typeOptions?.password).toBe(true);
    });
  });

  describe('ImmutableApi', () => {
    let credentials: ImmutableApi;

    beforeEach(() => {
      credentials = new ImmutableApi();
    });

    it('should have correct name', () => {
      expect(credentials.name).toBe('immutableApi');
    });

    it('should have correct display name', () => {
      expect(credentials.displayName).toBe('Immutable API');
    });

    it('should have environment property', () => {
      const envProp = credentials.properties.find(p => p.name === 'environment');
      expect(envProp).toBeDefined();
    });
  });

  describe('ImmutablePassport', () => {
    let credentials: ImmutablePassport;

    beforeEach(() => {
      credentials = new ImmutablePassport();
    });

    it('should have correct name', () => {
      expect(credentials.name).toBe('immutablePassport');
    });

    it('should have correct display name', () => {
      expect(credentials.displayName).toBe('Immutable Passport');
    });

    it('should have client ID property', () => {
      const clientIdProp = credentials.properties.find(p => p.name === 'clientId');
      expect(clientIdProp).toBeDefined();
      expect(clientIdProp?.type).toBe('string');
    });
  });
});
