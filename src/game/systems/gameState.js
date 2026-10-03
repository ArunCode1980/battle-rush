import { useSyncExternalStore } from "react";

const DEFAULT_INVENTORY = {
  ammo: 60,
  medkits: 0,
  grenades: 0,
};

const MAX_HEALTH = 100;

const playerPosition = {
  x: 0,
  y: 0,
  z: 0,
};

let inventory = {
  ...DEFAULT_INVENTORY,
};

let playerHealth = MAX_HEALTH;
let eliminated = false;

let snapshot = {
  playerPosition,
  inventory: { ...inventory },
  playerHealth,
  eliminated,
};

const listeners = new Set();

function emit() {
  snapshot = {
    playerPosition,
    inventory: { ...inventory },
    playerHealth,
    eliminated,
  };

  listeners.forEach((listener) => listener());
}

export const gameState = {
  // =========================================================
  // SUBSCRIPTION
  // =========================================================

  subscribe(listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot() {
    return snapshot;
  },

  getState() {
    return {
      playerPosition,
      inventory,
      playerHealth,
      eliminated,
    };
  },

  // =========================================================
  // PLAYER POSITION
  // =========================================================

  setPlayerPosition(x, y, z) {
    playerPosition.x = x;
    playerPosition.y = y;
    playerPosition.z = z;
  },

  // =========================================================
  // LOOT
  // =========================================================

  addLoot(type, amount) {
    if (!inventory[type]) {
      inventory[type] = 0;
    }

    inventory[type] += amount;

    emit();
  },

  removeLoot(type, amount) {
    if (!inventory[type]) {
      return false;
    }

    if (inventory[type] < amount) {
      return false;
    }

    inventory[type] -= amount;

    emit();

    return true;
  },

  // =========================================================
  // PLAYER DAMAGE
  // =========================================================

  damagePlayer(amount) {
    if (eliminated) {
      return;
    }

    if (amount <= 0) {
      return;
    }

    playerHealth = Math.max(
      0,
      playerHealth - amount
    );

    if (playerHealth <= 0) {
      playerHealth = 0;
      eliminated = true;
    }

    emit();
  },

  // =========================================================
  // HEAL
  // =========================================================

  healPlayer(amount) {
    if (eliminated) {
      return false;
    }

    if (amount <= 0) {
      return false;
    }

    if (playerHealth >= MAX_HEALTH) {
      return false;
    }

    const oldHealth = playerHealth;

    playerHealth = Math.min(
      MAX_HEALTH,
      playerHealth + amount
    );

    if (playerHealth === oldHealth) {
      return false;
    }

    emit();

    return true;
  },

  // =========================================================
  // MEDKIT
  // =========================================================

  useMedkit() {
    if (eliminated) {
      return false;
    }

    if (inventory.medkits <= 0) {
      return false;
    }

    if (playerHealth >= MAX_HEALTH) {
      return false;
    }

    inventory.medkits -= 1;

    playerHealth = Math.min(
      MAX_HEALTH,
      playerHealth + 40
    );

    emit();

    return true;
  },

  // =========================================================
  // HEALTH
  // =========================================================

  getMaxHealth() {
    return MAX_HEALTH;
  },

  // =========================================================
  // ELIMINATION
  // =========================================================

  isEliminated() {
    return eliminated;
  },

  // =========================================================
  // RESET MATCH
  // =========================================================

  resetMatch() {
    inventory = {
      ...DEFAULT_INVENTORY,
    };

    playerHealth = MAX_HEALTH;
    eliminated = false;

    playerPosition.x = 0;
    playerPosition.y = 0;
    playerPosition.z = 0;

    emit();
  },
};

export function useGameState() {
  return useSyncExternalStore(
    gameState.subscribe,
    gameState.getSnapshot,
    gameState.getSnapshot
  );
}