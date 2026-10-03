export const ASSAULT_RIFLE = {
  id: "assault_rifle",

  name: "BR-01",

  damage: 25,

  magazineSize: 30,

  fireRate: 600,

  reloadTime: 1800,

  range: 120,

  automatic: true,

  // =========================================================
  // RECOIL
  // =========================================================

  recoil: {
    // Normal hip-fire recoil
    vertical: 0.055,

    // ADS recoil is lower
    aimVertical: 0.032,

    // Small random horizontal movement
    horizontal: 0.018,

    // How quickly the weapon returns
    recovery: 9,
  },
};