import { CLOTHING_ITEMS, DEFAULT_CLOTHING_ID } from "../player/clothingData";

const STORAGE_KEY = "battle_rush_player_inventory_v1";

const defaultState = {
  currency: {
    gold: 1000,
    ruby: 1000,
  },

  ownedClothing: [DEFAULT_CLOTHING_ID],

  equipped: {
    clothing: DEFAULT_CLOTHING_ID,
  },

  downloaded: {
    clothing: [DEFAULT_CLOTHING_ID],
  },
};

let state = loadState();

const listeners = new Set();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultState;
    }

    const parsed = JSON.parse(saved);

    return {
      ...defaultState,
      ...parsed,
      currency: {
        ...defaultState.currency,
        ...(parsed.currency || {}),
      },
      equipped: {
        ...defaultState.equipped,
        ...(parsed.equipped || {}),
      },
      downloaded: {
        ...defaultState.downloaded,
        ...(parsed.downloaded || {}),
      },
    };
  } catch {
    return defaultState;
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

  listeners.forEach((listener) => listener());
}

export function subscribeInventory(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getInventorySnapshot() {
  return state;
}

export function getPlayerInventory() {
  return state;
}

export function getRubyBalance() {
  return state.currency.ruby;
}

export function isClothingOwned(itemId) {
  return state.ownedClothing.includes(itemId);
}

export function isClothingEquipped(itemId) {
  return state.equipped.clothing === itemId;
}

export function isClothingDownloaded(itemId) {
  return state.downloaded.clothing.includes(itemId);
}

export function buyClothing(itemId) {
  const item = CLOTHING_ITEMS[itemId];

  if (!item) {
    return {
      success: false,
      message: "ITEM NOT FOUND",
    };
  }

  if (isClothingOwned(itemId)) {
    return {
      success: false,
      message: "ALREADY OWNED",
    };
  }

  if (state.currency.ruby < item.price) {
    return {
      success: false,
      message: "NOT ENOUGH RUBIES",
    };
  }

  state = {
    ...state,

    currency: {
      ...state.currency,
      ruby: state.currency.ruby - item.price,
    },

    ownedClothing: [
      ...state.ownedClothing,
      itemId,
    ],

    downloaded: {
      ...state.downloaded,
      clothing: [
        ...state.downloaded.clothing,
        itemId,
      ],
    },
  };

  saveState();

  return {
    success: true,
    message: `${item.name} UNLOCKED`,
  };
}

export function equipClothing(itemId) {
  if (!isClothingOwned(itemId)) {
    return {
      success: false,
      message: "ITEM NOT OWNED",
    };
  }

  state = {
    ...state,

    equipped: {
      ...state.equipped,
      clothing: itemId,
    },
  };

  saveState();

  return {
    success: true,
    message: "OUTFIT EQUIPPED",
  };
}

export function downloadClothing(itemId) {
  if (!isClothingOwned(itemId)) {
    return {
      success: false,
      message: "ITEM NOT OWNED",
    };
  }

  if (isClothingDownloaded(itemId)) {
    return {
      success: true,
      message: "ALREADY DOWNLOADED",
    };
  }

  state = {
    ...state,

    downloaded: {
      ...state.downloaded,

      clothing: [
        ...state.downloaded.clothing,
        itemId,
      ],
    },
  };

  saveState();

  return {
    success: true,
    message: "OUTFIT DOWNLOADED",
  };
}

export function setRubyBalance(amount) {
  state = {
    ...state,

    currency: {
      ...state.currency,
      ruby: Math.max(0, amount),
    },
  };

  saveState();
}