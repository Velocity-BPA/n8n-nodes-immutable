/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ImmutableTrigger } from '../../nodes/Immutable/ImmutableTrigger.node';

describe('ImmutableTrigger Node', () => {
  let triggerNode: ImmutableTrigger;

  beforeEach(() => {
    triggerNode = new ImmutableTrigger();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(triggerNode.description.displayName).toBe('Immutable Trigger');
    });

    it('should have correct node name', () => {
      expect(triggerNode.description.name).toBe('immutableTrigger');
    });

    it('should be in trigger group', () => {
      expect(triggerNode.description.group).toContain('trigger');
    });

    it('should have no inputs (trigger node)', () => {
      expect(triggerNode.description.inputs).toEqual([]);
    });

    it('should have one output', () => {
      expect(triggerNode.description.outputs).toContain('main');
    });

    it('should have webhooks defined', () => {
      expect(triggerNode.description.webhooks).toBeDefined();
      expect(triggerNode.description.webhooks?.length).toBeGreaterThan(0);
    });
  });

  describe('Events', () => {
    it('should have event property', () => {
      const eventProp = triggerNode.description.properties.find(p => p.name === 'event');
      expect(eventProp).toBeDefined();
      expect(eventProp?.type).toBe('options');
    });

    it('should have NFT events', () => {
      const eventProp = triggerNode.description.properties.find(p => p.name === 'event');
      const eventOptions = eventProp?.options as Array<{ value: string }>;
      const eventValues = eventOptions?.map(o => o.value) || [];

      expect(eventValues).toContain('nft_created');
      expect(eventValues).toContain('nft_transferred');
      expect(eventValues).toContain('nft_burned');
      expect(eventValues).toContain('nft_listed');
      expect(eventValues).toContain('nft_sold');
    });

    it('should have order events', () => {
      const eventProp = triggerNode.description.properties.find(p => p.name === 'event');
      const eventOptions = eventProp?.options as Array<{ value: string }>;
      const eventValues = eventOptions?.map(o => o.value) || [];

      expect(eventValues).toContain('order_created');
      expect(eventValues).toContain('order_cancelled');
      expect(eventValues).toContain('order_filled');
    });

    it('should have all events option', () => {
      const eventProp = triggerNode.description.properties.find(p => p.name === 'event');
      const eventOptions = eventProp?.options as Array<{ value: string }>;
      const eventValues = eventOptions?.map(o => o.value) || [];

      expect(eventValues).toContain('all');
    });
  });

  describe('Filters', () => {
    it('should have filters property', () => {
      const filtersProp = triggerNode.description.properties.find(p => p.name === 'filters');
      expect(filtersProp).toBeDefined();
      expect(filtersProp?.type).toBe('collection');
    });

    it('should have collection address filter', () => {
      const filtersProp = triggerNode.description.properties.find(p => p.name === 'filters');
      const options = filtersProp?.options as Array<{ name: string }>;
      const filterNames = options?.map(o => o.name) || [];

      expect(filterNames).toContain('collectionAddress');
    });

    it('should have user address filter', () => {
      const filtersProp = triggerNode.description.properties.find(p => p.name === 'filters');
      const options = filtersProp?.options as Array<{ name: string }>;
      const filterNames = options?.map(o => o.name) || [];

      expect(filterNames).toContain('userAddress');
    });
  });

  describe('Webhook Methods', () => {
    it('should have webhook methods defined', () => {
      expect(triggerNode.webhookMethods).toBeDefined();
      expect(triggerNode.webhookMethods.default).toBeDefined();
    });

    it('should have checkExists method', () => {
      expect(triggerNode.webhookMethods.default.checkExists).toBeDefined();
      expect(typeof triggerNode.webhookMethods.default.checkExists).toBe('function');
    });

    it('should have create method', () => {
      expect(triggerNode.webhookMethods.default.create).toBeDefined();
      expect(typeof triggerNode.webhookMethods.default.create).toBe('function');
    });

    it('should have delete method', () => {
      expect(triggerNode.webhookMethods.default.delete).toBeDefined();
      expect(typeof triggerNode.webhookMethods.default.delete).toBe('function');
    });
  });
});
