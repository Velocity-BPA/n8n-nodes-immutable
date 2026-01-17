/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Immutable } from '../../nodes/Immutable/Immutable.node';

describe('Immutable Node', () => {
  let immutableNode: Immutable;

  beforeEach(() => {
    immutableNode = new Immutable();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(immutableNode.description.displayName).toBe('Immutable');
    });

    it('should have correct node name', () => {
      expect(immutableNode.description.name).toBe('immutable');
    });

    it('should have correct version', () => {
      expect(immutableNode.description.version).toBe(1);
    });

    it('should have icon defined', () => {
      expect(immutableNode.description.icon).toBe('file:immutable.svg');
    });

    it('should have inputs and outputs defined', () => {
      expect(immutableNode.description.inputs).toContain('main');
      expect(immutableNode.description.outputs).toContain('main');
    });

    it('should require immutableNetwork credentials', () => {
      const credentials = immutableNode.description.credentials;
      expect(credentials).toBeDefined();
      const networkCred = credentials?.find(c => c.name === 'immutableNetwork');
      expect(networkCred).toBeDefined();
      expect(networkCred?.required).toBe(true);
    });
  });

  describe('Resources', () => {
    it('should have resource property', () => {
      const resourceProp = immutableNode.description.properties.find(p => p.name === 'resource');
      expect(resourceProp).toBeDefined();
      expect(resourceProp?.type).toBe('options');
    });

    it('should have expected resources', () => {
      const resourceProp = immutableNode.description.properties.find(p => p.name === 'resource');
      const resourceOptions = resourceProp?.options as Array<{ value: string }>;
      const resourceValues = resourceOptions?.map(o => o.value) || [];

      expect(resourceValues).toContain('wallet');
      expect(resourceValues).toContain('nft');
      expect(resourceValues).toContain('collection');
      expect(resourceValues).toContain('minting');
      expect(resourceValues).toContain('order');
      expect(resourceValues).toContain('trade');
      expect(resourceValues).toContain('zkevm');
      expect(resourceValues).toContain('activity');
      expect(resourceValues).toContain('utility');
    });
  });

  describe('Operations', () => {
    it('should have wallet operations', () => {
      const walletOps = immutableNode.description.properties.find(
        p => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('wallet')
      );
      expect(walletOps).toBeDefined();
      const options = walletOps?.options as Array<{ value: string }>;
      const opValues = options?.map(o => o.value) || [];
      expect(opValues).toContain('getBalance');
      expect(opValues).toContain('getTokenBalances');
    });

    it('should have nft operations', () => {
      const nftOps = immutableNode.description.properties.find(
        p => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('nft')
      );
      expect(nftOps).toBeDefined();
      const options = nftOps?.options as Array<{ value: string }>;
      const opValues = options?.map(o => o.value) || [];
      expect(opValues).toContain('getNft');
      expect(opValues).toContain('getNftsByCollection');
      expect(opValues).toContain('getNftsByOwner');
    });

    it('should have zkevm operations', () => {
      const zkevmOps = immutableNode.description.properties.find(
        p => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('zkevm')
      );
      expect(zkevmOps).toBeDefined();
      const options = zkevmOps?.options as Array<{ value: string }>;
      const opValues = options?.map(o => o.value) || [];
      expect(opValues).toContain('getGasPrice');
      expect(opValues).toContain('getBlock');
      expect(opValues).toContain('getTransaction');
    });
  });
});
