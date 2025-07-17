// <stdin>
import React, { useState, useEffect, useCallback, useMemo } from "https://esm.sh/react@18.2.0";
var GAME_CONSTANTS = {
  HAND_LIMIT: 5,
  NOTIFICATIONS_LIMIT: 3,
  NOTIFICATION_DURATION: 3e3,
  ESCAPE_SUCCESS_THRESHOLD: 5,
  CRITICAL_HEALTH_THRESHOLD: 0.3,
  ENERGY_REGEN_INTERVAL: 3e4,
  AUTO_SAVE_INTERVAL: 1e4,
  RANDOM_EVENT_CHANCE: 0.2,
  EASTER_EGG_CHANCE: 0.05,
  QUEST_COMPLETION_REWARD: 50
};
var UI_CONSTANTS = {
  COLORS: {
    primary: "from-blue-400 to-violet-400",
    success: "from-green-400 to-emerald-400",
    danger: "from-red-400 to-pink-400",
    warning: "from-orange-400 to-yellow-400",
    legendary: "from-yellow-400 to-orange-400"
  },
  CARD_STYLE: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px"
  },
  BREAKPOINTS: {
    mobile: "768px",
    tablet: "1024px"
  }
};
var DIFFICULTY_MODES = {
  easy: {
    name: "\u041B\u0435\u0433\u043A\u0438\u0439",
    icon: "\u{1F7E2}",
    description: "\u0414\u043B\u044F \u043D\u043E\u0432\u0438\u0447\u043A\u043E\u0432 - \u0431\u043E\u043B\u044C\u0448\u0435 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F \u0438 \u0437\u043E\u043B\u043E\u0442\u0430",
    healthMultiplier: 1.5,
    goldMultiplier: 1.5,
    enemyPowerMultiplier: 0.8,
    levelUpChance: 0.4
  },
  normal: {
    name: "\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u044B\u0439",
    icon: "\u{1F7E1}",
    description: "\u0421\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043E\u043F\u044B\u0442",
    healthMultiplier: 1,
    goldMultiplier: 1,
    enemyPowerMultiplier: 1,
    levelUpChance: 0.3
  },
  hardcore: {
    name: "\u0425\u0430\u0440\u0434\u043A\u043E\u0440",
    icon: "\u{1F534}",
    description: "\u0414\u043B\u044F \u044D\u043A\u0441\u043F\u0435\u0440\u0442\u043E\u0432 - \u043C\u0435\u043D\u044C\u0448\u0435 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F, \u0441\u0438\u043B\u044C\u043D\u0435\u0435 \u0432\u0440\u0430\u0433\u0438",
    healthMultiplier: 0.7,
    goldMultiplier: 0.8,
    enemyPowerMultiplier: 1.3,
    levelUpChance: 0.2
  }
};
var THEMES = {
  classic: {
    name: "\u041A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0430\u044F",
    icon: "\u{1F3F0}",
    unlocked: true,
    heroIcon: "\u{1F934}",
    bgGradient: "from-slate-50 via-blue-50 to-violet-50",
    cardGradient: "from-blue-400 to-violet-400"
  },
  dark: {
    name: "\u0422\u0451\u043C\u043D\u0430\u044F",
    icon: "\u{1F319}",
    unlocked: false,
    unlockCondition: (stats) => stats.victories >= 5,
    heroIcon: "\u{1F9D9}\u200D\u2642\uFE0F",
    bgGradient: "from-gray-900 via-purple-900 to-indigo-900",
    cardGradient: "from-purple-500 to-indigo-500"
  },
  fire: {
    name: "\u041E\u0433\u043D\u0435\u043D\u043D\u0430\u044F",
    icon: "\u{1F525}",
    unlocked: false,
    unlockCondition: (stats) => stats.maxLevel >= 5,
    heroIcon: "\u{1F525}",
    bgGradient: "from-red-100 via-orange-100 to-yellow-100",
    cardGradient: "from-red-400 to-orange-400"
  },
  nature: {
    name: "\u041F\u0440\u0438\u0440\u043E\u0434\u043D\u0430\u044F",
    icon: "\u{1F33F}",
    unlocked: false,
    unlockCondition: (stats) => stats.treasuresCollected >= 15,
    heroIcon: "\u{1F9DA}\u200D\u2640\uFE0F",
    bgGradient: "from-green-100 via-emerald-100 to-teal-100",
    cardGradient: "from-green-400 to-teal-400"
  }
};
var MONSTERS = [
  {
    id: 1,
    name: "\u0413\u043E\u0431\u043B\u0438\u043D",
    icon: "\u{1F479}",
    level: 1,
    power: 2,
    treasure: 1,
    health: 15,
    description: "\u041C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0439 \u0438 \u0437\u043B\u043E\u0431\u043D\u044B\u0439",
    criticalChance: 0.1
  },
  {
    id: 2,
    name: "\u041E\u0440\u043A",
    icon: "\u{1F47A}",
    level: 3,
    power: 4,
    treasure: 2,
    health: 30,
    description: "\u0421\u0438\u043B\u044C\u043D\u044B\u0439 \u0438 \u0436\u0435\u0441\u0442\u043E\u043A\u0438\u0439",
    criticalChance: 0.15
  },
  {
    id: 3,
    name: "\u0414\u0440\u0430\u043A\u043E\u043D",
    icon: "\u{1F409}",
    level: 8,
    power: 12,
    treasure: 4,
    health: 80,
    description: "\u041C\u043E\u0433\u0443\u0449\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0438 \u043E\u043F\u0430\u0441\u043D\u044B\u0439",
    criticalChance: 0.2
  },
  {
    id: 4,
    name: "\u0421\u043A\u0435\u043B\u0435\u0442",
    icon: "\u{1F480}",
    level: 2,
    power: 3,
    treasure: 1,
    health: 20,
    description: "\u041D\u0435\u0436\u0438\u0442\u044C \u0438\u0437 \u043F\u043E\u0434\u0437\u0435\u043C\u0435\u043B\u0438\u0439",
    criticalChance: 0.05
  },
  {
    id: 5,
    name: "\u0422\u0440\u043E\u043B\u043B\u044C",
    icon: "\u{1F9CC}",
    level: 5,
    power: 8,
    treasure: 3,
    health: 50,
    description: "\u041E\u0433\u0440\u043E\u043C\u043D\u044B\u0439 \u0438 \u0440\u0435\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u044E\u0449\u0438\u0439",
    criticalChance: 0.12
  },
  {
    id: 6,
    name: "\u041F\u0440\u0438\u0437\u0440\u0430\u043A",
    icon: "\u{1F47B}",
    level: 4,
    power: 6,
    treasure: 2,
    health: 25,
    description: "\u042D\u0444\u0435\u043C\u0435\u0440\u043D\u044B\u0439 \u0438 \u0442\u0430\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439",
    criticalChance: 0.25
  }
];
var TREASURES = [
  {
    id: 1,
    name: "\u041C\u0435\u0447",
    icon: "\u2694\uFE0F",
    type: "weapon",
    power: 3,
    rarity: "common",
    description: "\u041E\u0441\u0442\u0440\u044B\u0439 \u043A\u043B\u0438\u043D\u043E\u043A",
    price: 20
  },
  {
    id: 2,
    name: "\u0429\u0438\u0442",
    icon: "\u{1F6E1}\uFE0F",
    type: "armor",
    power: 2,
    rarity: "common",
    description: "\u041A\u0440\u0435\u043F\u043A\u0430\u044F \u0437\u0430\u0449\u0438\u0442\u0430",
    price: 15
  },
  {
    id: 3,
    name: "\u0421\u0430\u043F\u043E\u0433\u0438",
    icon: "\u{1F462}",
    type: "boots",
    power: 1,
    rarity: "common",
    description: "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u043D\u043E\u0433\u0438",
    price: 10
  },
  {
    id: 4,
    name: "\u041C\u0430\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043F\u043E\u0441\u043E\u0445",
    icon: "\u{1FA84}",
    type: "weapon",
    power: 4,
    rarity: "rare",
    description: "\u041F\u0443\u043B\u044C\u0441\u0438\u0440\u0443\u0435\u0442 \u043C\u0430\u0433\u0438\u0435\u0439",
    price: 50
  },
  {
    id: 5,
    name: "\u0417\u0435\u043B\u044C\u0435 \u0441\u0438\u043B\u044B",
    icon: "\u{1F9EA}",
    type: "potion",
    power: 2,
    rarity: "uncommon",
    description: "\u0412\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0441\u0438\u043B\u0443",
    price: 25
  },
  {
    id: 6,
    name: "\u041A\u043E\u043B\u044C\u0446\u043E \u0437\u0430\u0449\u0438\u0442\u044B",
    icon: "\u{1F48D}",
    type: "accessory",
    power: 3,
    rarity: "rare",
    description: "\u041C\u0430\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0437\u0430\u0449\u0438\u0442\u0430",
    price: 40
  }
];
var ACTIVE_ITEMS = [
  {
    id: 101,
    name: "\u041F\u043E\u0441\u043E\u0445 \u043C\u043E\u043B\u043D\u0438\u0438",
    icon: "\u26A1",
    type: "weapon",
    power: 3,
    rarity: "epic",
    description: "\u041D\u0430\u043D\u043E\u0441\u0438\u0442 \u043C\u043E\u043B\u043D\u0438\u0435\u0432\u044B\u0439 \u0443\u0434\u0430\u0440",
    price: 100,
    activeAbility: {
      name: "\u041C\u043E\u043B\u043D\u0438\u044F",
      description: "\u041D\u0430\u043D\u043E\u0441\u0438\u0442 8 \u0443\u0440\u043E\u043D\u0430",
      cooldown: 3,
      damage: 8
    }
  },
  {
    id: 102,
    name: "\u0421\u0432\u044F\u0442\u0430\u044F \u0433\u0440\u0430\u043D\u0430\u0442\u0430",
    icon: "\u{1F4A5}",
    type: "accessory",
    power: 1,
    rarity: "legendary",
    description: "\u041C\u043E\u0449\u043D\u044B\u0439 \u0432\u0437\u0440\u044B\u0432",
    price: 150,
    activeAbility: {
      name: "\u0412\u0437\u0440\u044B\u0432",
      description: "\u041D\u0430\u043D\u043E\u0441\u0438\u0442 12 \u0443\u0440\u043E\u043D\u0430",
      cooldown: 5,
      damage: 12
    }
  },
  {
    id: 103,
    name: "\u041B\u0435\u0447\u0435\u0431\u043D\u044B\u0439 \u0430\u043C\u0443\u043B\u0435\u0442",
    icon: "\u2728",
    type: "accessory",
    power: 2,
    rarity: "rare",
    description: "\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435",
    price: 80,
    activeAbility: {
      name: "\u0418\u0441\u0446\u0435\u043B\u0435\u043D\u0438\u0435",
      description: "\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442 20 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F",
      cooldown: 4,
      heal: 20
    }
  }
];
var RANDOM_EVENTS = [
  {
    id: 1,
    name: "\u041B\u043E\u0432\u0443\u0448\u043A\u0430!",
    icon: "\u{1F573}\uFE0F",
    description: "\u0412\u044B \u043F\u043E\u043F\u0430\u043B\u0438 \u0432 \u043B\u043E\u0432\u0443\u0448\u043A\u0443 \u0438 \u043F\u043E\u0442\u0435\u0440\u044F\u043B\u0438 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F",
    effect: (hero) => ({ ...hero, health: Math.max(1, hero.health - 15) }),
    type: "negative"
  },
  {
    id: 2,
    name: "\u0421\u0447\u0430\u0441\u0442\u043B\u0438\u0432\u0430\u044F \u043D\u0430\u0445\u043E\u0434\u043A\u0430",
    icon: "\u{1F4B0}",
    description: "\u0412\u044B \u043D\u0430\u0448\u043B\u0438 \u043A\u043E\u0448\u0435\u043B\u0435\u043A \u0441 \u0437\u043E\u043B\u043E\u0442\u043E\u043C!",
    effect: (hero) => ({ ...hero, gold: hero.gold + 30 }),
    type: "positive"
  },
  {
    id: 3,
    name: "\u0411\u043B\u0430\u0433\u043E\u0441\u043B\u043E\u0432\u0435\u043D\u0438\u0435",
    icon: "\u{1F64F}",
    description: "\u0411\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u0441\u0438\u043B\u0430 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442 \u0432\u0430\u0448\u0435 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435",
    effect: (hero) => ({ ...hero, health: Math.min(hero.maxHealth, hero.health + 25) }),
    type: "positive"
  },
  {
    id: 4,
    name: "\u041F\u0440\u043E\u043A\u043B\u044F\u0442\u0438\u0435",
    icon: "\u{1F608}",
    description: "\u0422\u0451\u043C\u043D\u0430\u044F \u043C\u0430\u0433\u0438\u044F \u043E\u0441\u043B\u0430\u0431\u043B\u044F\u0435\u0442 \u0432\u0430\u0441 \u043D\u0430 \u0432\u0440\u0435\u043C\u044F",
    effect: (hero) => ({ ...hero, cursed: true, curseCounter: 3 }),
    type: "negative"
  },
  {
    id: 5,
    name: "\u0422\u043E\u0440\u0433\u043E\u0432\u0435\u0446",
    icon: "\u{1F9D9}\u200D\u2642\uFE0F",
    description: "\u0422\u043E\u0440\u0433\u043E\u0432\u0435\u0446 \u043F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u0442 \u0432\u0430\u043C \u0432\u044B\u0433\u043E\u0434\u043D\u0443\u044E \u0441\u0434\u0435\u043B\u043A\u0443",
    effect: (hero) => ({ ...hero, merchantVisit: true }),
    type: "neutral"
  }
];
var MINI_QUESTS = [
  {
    id: 1,
    name: "\u0423\u0431\u0438\u0439\u0446\u0430 \u0433\u043E\u0431\u043B\u0438\u043D\u043E\u0432",
    description: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u0435 3 \u0433\u043E\u0431\u043B\u0438\u043D\u043E\u0432",
    icon: "\u{1F479}",
    target: 3,
    condition: (stats, monster) => monster.name === "\u0413\u043E\u0431\u043B\u0438\u043D",
    reward: { gold: 50, experience: 25 }
  },
  {
    id: 2,
    name: "\u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u043E\u043D\u0435\u0440",
    description: "\u0421\u043E\u0431\u0435\u0440\u0438\u0442\u0435 5 \u0441\u043E\u043A\u0440\u043E\u0432\u0438\u0449",
    icon: "\u{1F48E}",
    target: 5,
    condition: (stats) => stats.treasuresCollected,
    reward: { gold: 30, health: 20 }
  },
  {
    id: 3,
    name: "\u0421\u0435\u0440\u0438\u0439\u043D\u044B\u0439 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C",
    description: "\u0412\u044B\u0438\u0433\u0440\u0430\u0439\u0442\u0435 3 \u0431\u043E\u044F \u043F\u043E\u0434\u0440\u044F\u0434",
    icon: "\u{1F3C6}",
    target: 3,
    condition: "winStreak",
    reward: { gold: 75, level: 1 }
  },
  {
    id: 4,
    name: "\u0417\u043E\u043B\u043E\u0442\u043E\u0438\u0441\u043A\u0430\u0442\u0435\u043B\u044C",
    description: "\u041D\u0430\u043A\u043E\u043F\u0438\u0442\u0435 200 \u0437\u043E\u043B\u043E\u0442\u0430",
    icon: "\u{1F4B0}",
    target: 200,
    condition: (stats, monster, hero) => hero.gold >= 200,
    reward: { experience: 50 }
  }
];
var EASTER_EGGS = [
  {
    id: 1,
    message: '\u{1F3AD} "\u042D\u0442\u043E \u043D\u0435 \u0431\u0430\u0433, \u044D\u0442\u043E \u0444\u0438\u0447\u0430!" - \u041F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0438\u0441\u0442',
    type: "meme"
  },
  {
    id: 2,
    message: "\u{1F41B} \u0412\u044B \u043D\u0430\u0448\u043B\u0438 \u0440\u0435\u0434\u043A\u043E\u0433\u043E \u0446\u0438\u0444\u0440\u043E\u0432\u043E\u0433\u043E \u0436\u0443\u043A\u0430! (+1 \u043A \u0443\u0434\u0430\u0447\u0435)",
    type: "bonus",
    effect: (hero) => ({ ...hero, luck: (hero.luck || 0) + 1 })
  },
  {
    id: 3,
    message: '\u{1F3AA} "\u0416\u0438\u0437\u043D\u044C \u043A\u0430\u043A \u0446\u0438\u0440\u043A, \u0430 \u043C\u044B \u0432\u0441\u0435 \u043A\u043B\u043E\u0443\u043D\u044B" - \u041C\u0443\u0434\u0440\u044B\u0439 \u0433\u043E\u0431\u043B\u0438\u043D',
    type: "wisdom"
  },
  {
    id: 4,
    message: "\u{1F3AE} \u041F\u0430\u0441\u0445\u0430\u043B\u043A\u0430 #4: \u041F\u043E\u043C\u043D\u0438\u0442\u0435, \u0447\u0442\u043E \u0441\u0430\u043C\u044B\u0439 \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0433 - \u044D\u0442\u043E \u043F\u0440\u043E\u043A\u0440\u0430\u0441\u0442\u0438\u043D\u0430\u0446\u0438\u044F!",
    type: "meta"
  },
  {
    id: 5,
    message: '\u{1F916} "\u0414\u0430, \u044F \u0418\u0418, \u043D\u043E \u0443 \u043C\u0435\u043D\u044F \u0435\u0441\u0442\u044C \u0447\u0443\u0432\u0441\u0442\u0432\u043E \u044E\u043C\u043E\u0440\u0430!" - \u0412\u0430\u0448 \u043A\u043E\u0434',
    type: "ai"
  }
];
var LEVEL_UP_UPGRADES = [
  {
    id: 1,
    name: "\u041A\u0440\u0435\u043F\u043A\u043E\u0435 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435",
    icon: "\u2764\uFE0F",
    description: "+15 \u043A \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u043C\u0443 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044E",
    effect: (hero) => ({
      ...hero,
      maxHealth: hero.maxHealth + 15,
      health: hero.health + 15
    })
  },
  {
    id: 2,
    name: "\u0423\u0434\u0430\u0447\u0430 \u0432 \u0431\u043E\u044E",
    icon: "\u{1F340}",
    description: "+10% \u0448\u0430\u043D\u0441 \u043A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0443\u0434\u0430\u0440\u0430",
    effect: (hero) => ({
      ...hero,
      criticalChance: (hero.criticalChance || 0) + 0.1
    })
  },
  {
    id: 3,
    name: "\u041B\u043E\u0432\u043A\u043E\u0441\u0442\u044C",
    icon: "\u{1F4A8}",
    description: "+10% \u0448\u0430\u043D\u0441 \u0443\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F",
    effect: (hero) => ({
      ...hero,
      dodgeChance: (hero.dodgeChance || 0) + 0.1
    })
  },
  {
    id: 4,
    name: "\u0422\u043E\u0440\u0433\u043E\u0432\u0435\u0446",
    icon: "\u{1F4B0}",
    description: "+50% \u0431\u043E\u043B\u044C\u0448\u0435 \u0437\u043E\u043B\u043E\u0442\u0430 \u0441 \u043F\u043E\u0431\u0435\u0434",
    effect: (hero) => ({
      ...hero,
      goldMultiplier: (hero.goldMultiplier || 1) + 0.5
    })
  },
  {
    id: 5,
    name: "\u0420\u0435\u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F",
    icon: "\u{1F504}",
    description: "\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442 5 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F \u043F\u043E\u0441\u043B\u0435 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0431\u043E\u044F",
    effect: (hero) => ({
      ...hero,
      regeneration: (hero.regeneration || 0) + 5
    })
  },
  {
    id: 6,
    name: "\u041C\u0430\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0449\u0438\u0442",
    icon: "\u{1F6E1}\uFE0F",
    description: "+2 \u043A \u0437\u0430\u0449\u0438\u0442\u0435",
    effect: (hero) => ({
      ...hero,
      magicShield: (hero.magicShield || 0) + 2
    })
  }
];
var ACHIEVEMENTS = [
  {
    id: "first_victory",
    name: "\u041F\u0435\u0440\u0432\u0430\u044F \u043F\u043E\u0431\u0435\u0434\u0430",
    description: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u0435 \u0441\u0432\u043E\u0435\u0433\u043E \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u043C\u043E\u043D\u0441\u0442\u0440\u0430",
    icon: "\u{1F389}",
    condition: (stats) => stats.victories >= 1
  },
  {
    id: "treasure_hunter",
    name: "\u041E\u0445\u043E\u0442\u043D\u0438\u043A \u0437\u0430 \u0441\u043E\u043A\u0440\u043E\u0432\u0438\u0449\u0430\u043C\u0438",
    description: "\u0421\u043E\u0431\u0435\u0440\u0438\u0442\u0435 10 \u0441\u043E\u043A\u0440\u043E\u0432\u0438\u0449",
    icon: "\u{1F48E}",
    condition: (stats) => stats.treasuresCollected >= 10
  },
  {
    id: "level_master",
    name: "\u041C\u0430\u0441\u0442\u0435\u0440 \u0443\u0440\u043E\u0432\u043D\u0435\u0439",
    description: "\u0414\u043E\u0441\u0442\u0438\u0433\u043D\u0438\u0442\u0435 5 \u0443\u0440\u043E\u0432\u043D\u044F",
    icon: "\u2B50",
    condition: (stats) => stats.maxLevel >= 5
  },
  {
    id: "gold_hoarder",
    name: "\u0421\u043A\u0443\u043F\u0435\u0440\u0434\u044F\u0439",
    description: "\u041D\u0430\u043A\u043E\u043F\u0438\u0442\u0435 500 \u0437\u043E\u043B\u043E\u0442\u0430",
    icon: "\u{1F4B0}",
    condition: (stats, hero) => hero.gold >= 500
  },
  {
    id: "unstoppable",
    name: "\u041D\u0435\u0443\u0434\u0435\u0440\u0436\u0438\u043C\u044B\u0439",
    description: "\u0412\u044B\u0438\u0433\u0440\u0430\u0439\u0442\u0435 5 \u0431\u043E\u0435\u0432 \u043F\u043E\u0434\u0440\u044F\u0434",
    icon: "\u{1F525}",
    condition: (stats) => stats.maxWinStreak >= 5
  }
];
var isValidValue = (value) => value !== null && value !== void 0;
var generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
var getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
var shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
var useLocalStorage = (key, initialValue, onError = null) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      if (onError) onError(error);
      return initialValue;
    }
  });
  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      if (onError) onError(error);
    }
  }, [key, onError]);
  return [storedValue, setValue];
};
var useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const addNotification = useCallback((message, type = "info") => {
    const notification = {
      id: generateId(),
      message,
      type,
      timestamp: Date.now()
    };
    setNotifications((prev) => [...prev, notification].slice(-GAME_CONSTANTS.NOTIFICATIONS_LIMIT));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, GAME_CONSTANTS.NOTIFICATION_DURATION);
  }, []);
  return { notifications, addNotification };
};
var useAnimations = () => {
  const [animations, setAnimations] = useState({});
  const triggerAnimation = useCallback((key, animationClass = "animate-pulse") => {
    setAnimations((prev) => ({ ...prev, [key]: animationClass }));
    setTimeout(() => {
      setAnimations((prev) => ({ ...prev, [key]: null }));
    }, 1e3);
  }, []);
  return { animations, triggerAnimation };
};
var LoadingScreen = () => /* @__PURE__ */ React.createElement("div", { className: "w-full h-full min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500 to-blue-600" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-6xl mb-4 animate-bounce" }, "\u{1F0CF}"), /* @__PURE__ */ React.createElement("div", { className: "text-white text-xl animate-pulse" }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u041C\u0430\u043D\u0447\u043A\u0438\u043D\u0430...")));
var ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    const handleError = (error) => {
      console.error("Game Error:", error);
      setHasError(true);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);
  if (hasError) {
    return fallback || /* @__PURE__ */ React.createElement("div", { className: "w-full h-full flex items-center justify-center bg-red-50" }, /* @__PURE__ */ React.createElement("div", { className: "text-center p-6" }, /* @__PURE__ */ React.createElement("div", { className: "text-6xl mb-4" }, "\u{1F635}"), /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold text-red-800 mb-2" }, "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A"), /* @__PURE__ */ React.createElement("p", { className: "text-red-600 mb-4" }, "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u0432 \u0438\u0433\u0440\u0435"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => window.location.reload(),
        className: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      },
      "\u041F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0433\u0440\u0443"
    )));
  }
  return children;
};
var Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center";
  const variants = {
    primary: `bg-gradient-to-r ${UI_CONSTANTS.COLORS.primary} text-white hover:scale-105 active:scale-95`,
    success: `bg-gradient-to-r ${UI_CONSTANTS.COLORS.success} text-white hover:scale-105 active:scale-95`,
    danger: `bg-gradient-to-r ${UI_CONSTANTS.COLORS.danger} text-white hover:scale-105 active:scale-95`,
    warning: `bg-gradient-to-r ${UI_CONSTANTS.COLORS.warning} text-white hover:scale-105 active:scale-95`,
    legendary: `bg-gradient-to-r ${UI_CONSTANTS.COLORS.legendary} text-white hover:scale-105 active:scale-95`,
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };
  const sizes = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`,
      disabled,
      onClick,
      ...props
    },
    children
  );
};
var Card = ({
  card,
  onClick,
  className = "",
  showStats = true,
  disabled = false,
  animation = null
}) => {
  if (!card || !isValidValue(card.name)) {
    return /* @__PURE__ */ React.createElement("div", { className: `p-3 rounded-xl border-2 border-gray-300 bg-gray-100 ${className}` }, /* @__PURE__ */ React.createElement("div", { className: "text-center text-gray-500" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl mb-2" }, "\u2753"), /* @__PURE__ */ React.createElement("div", { className: "text-sm" }, "\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u0430")));
  }
  const rarityColors = {
    common: "border-gray-300",
    uncommon: "border-green-400",
    rare: "border-blue-400",
    epic: "border-purple-400",
    legendary: "border-yellow-400"
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: disabled ? void 0 : onClick,
      className: `
        relative p-3 rounded-xl border-2 transition-all duration-300 
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"} 
        ${rarityColors[card.rarity] || "border-gray-300"}
        ${animation || ""}
        ${className}
      `,
      style: UI_CONSTANTS.CARD_STYLE
    },
    /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl mb-2" }, card.icon || "\u2753"), /* @__PURE__ */ React.createElement("div", { className: "font-bold text-sm mb-1" }, card.name), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600 mb-1" }, card.description || ""), showStats && card.power && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-blue-600 font-semibold" }, "\u0421\u0438\u043B\u0430: +", card.power), card.activeAbility && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-purple-600 font-semibold mt-1" }, "\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u0441\u043F\u043E\u0441\u043E\u0431\u043D\u043E\u0441\u0442\u044C: ", card.activeAbility.name), card.rarity && /* @__PURE__ */ React.createElement("div", { className: `text-xs mt-1 font-medium ${card.rarity === "legendary" ? "text-yellow-600" : card.rarity === "epic" ? "text-purple-600" : card.rarity === "rare" ? "text-blue-600" : card.rarity === "uncommon" ? "text-green-600" : "text-gray-600"}` }, card.rarity))
  );
};
var Modal = ({ isOpen, onClose, title, children, showClose = true }) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-md w-full max-h-[90vh] overflow-auto", style: UI_CONSTANTS.CARD_STYLE }, /* @__PURE__ */ React.createElement("div", { className: "p-6" }, title && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold" }, title), showClose && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onClose,
      className: "text-gray-500 hover:text-gray-700 text-2xl leading-none"
    },
    "\xD7"
  )), children)));
};
var Notifications = ({ notifications }) => {
  if (!notifications || notifications.length === 0) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed top-20 right-2 z-50 space-y-1 max-w-xs" }, notifications.map((notification) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: notification.id,
      className: `p-3 rounded-xl text-white text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-500 transform ${notification.type === "success" ? "bg-green-500 animate-bounce" : notification.type === "error" ? "bg-red-500 animate-shake" : notification.type === "warning" ? "bg-orange-500 animate-pulse" : "bg-blue-500 animate-slide-in"}`
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-base" }, notification.type === "success" ? "\u2705" : notification.type === "warning" ? "\u26A0\uFE0F" : notification.type === "error" ? "\u274C" : "\u2139\uFE0F"), /* @__PURE__ */ React.createElement("div", null, notification.message))
  )));
};
var DifficultySelector = ({ onSelect }) => /* @__PURE__ */ React.createElement(Modal, { isOpen: true, onClose: null, title: "\u{1F3AF} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u0438", showClose: false }, /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, Object.entries(DIFFICULTY_MODES).map(([key, mode]) => /* @__PURE__ */ React.createElement(
  Button,
  {
    key,
    onClick: () => onSelect(key),
    variant: key === "hardcore" ? "danger" : key === "easy" ? "success" : "primary",
    className: "w-full text-left"
  },
  /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl" }, mode.icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-bold" }, mode.name), /* @__PURE__ */ React.createElement("div", { className: "text-sm opacity-80" }, mode.description)))
))));
var LevelUpModal = ({ isOpen, onClose, onSelectUpgrade, upgrades }) => /* @__PURE__ */ React.createElement(Modal, { isOpen, onClose, title: "\u{1F389} \u041F\u043E\u0432\u044B\u0448\u0435\u043D\u0438\u0435 \u0443\u0440\u043E\u0432\u043D\u044F!", showClose: false }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-center text-gray-600" }, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043E\u0434\u043D\u043E \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u0435:"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, upgrades.map((upgrade) => /* @__PURE__ */ React.createElement(
  Button,
  {
    key: upgrade.id,
    onClick: () => onSelectUpgrade(upgrade),
    variant: "primary",
    className: "w-full text-left"
  },
  /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl" }, upgrade.icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-bold" }, upgrade.name), /* @__PURE__ */ React.createElement("div", { className: "text-sm opacity-80" }, upgrade.description)))
)))));
var RandomEventModal = ({ isOpen, onClose, event }) => /* @__PURE__ */ React.createElement(Modal, { isOpen, onClose, title: event ? `${event.icon} ${event.name}` : "" }, event && /* @__PURE__ */ React.createElement("div", { className: "text-center space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-6xl animate-bounce" }, event.icon), /* @__PURE__ */ React.createElement("p", { className: "text-gray-700" }, event.description), /* @__PURE__ */ React.createElement(Button, { onClick: onClose, variant: "primary" }, "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C")));
var QuestTracker = ({ quests, onQuestComplete }) => {
  const activeQuests = quests.filter((q) => q.active && !q.completed);
  if (activeQuests.length === 0) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "p-4", style: UI_CONSTANTS.CARD_STYLE }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-center mb-3" }, "\u{1F4CB} \u0417\u0430\u0434\u0430\u043D\u0438\u044F"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, activeQuests.map((quest) => /* @__PURE__ */ React.createElement("div", { key: quest.id, className: "p-2 bg-gray-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg" }, quest.icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-sm" }, quest.name), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, quest.description))), /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold text-blue-600" }, quest.progress || 0, "/", quest.target)), quest.progress >= quest.target && /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: () => onQuestComplete(quest),
      variant: "success",
      size: "small",
      className: "w-full mt-2"
    },
    "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C"
  )))));
};
var Leaderboard = ({ gameStats, allTimeStats }) => /* @__PURE__ */ React.createElement("div", { className: "p-4", style: UI_CONSTANTS.CARD_STYLE }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-center mb-3" }, "\u{1F3C6} \u0420\u0435\u043A\u043E\u0440\u0434\u044B"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-yellow-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-yellow-600" }, allTimeStats.bestLevel), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u041B\u0443\u0447\u0448\u0438\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-green-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-green-600" }, allTimeStats.maxGold), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u0411\u043E\u043B\u044C\u0448\u0435 \u0432\u0441\u0435\u0433\u043E \u0437\u043E\u043B\u043E\u0442\u0430")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-blue-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-blue-600" }, allTimeStats.totalVictories), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u041E\u0431\u0449\u0438\u0435 \u043F\u043E\u0431\u0435\u0434\u044B")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-purple-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-purple-600" }, allTimeStats.maxWinStreak), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u041B\u0443\u0447\u0448\u0430\u044F \u0441\u0435\u0440\u0438\u044F"))), /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-gray-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-600" }, "\u0412\u0440\u0435\u043C\u044F \u0438\u0433\u0440\u044B: ", Math.floor(allTimeStats.totalPlayTime / 60), ":", (allTimeStats.totalPlayTime % 60).toString().padStart(2, "0")))));
var ThemeSelector = ({ currentTheme, onThemeChange, unlockedThemes, gameStats }) => /* @__PURE__ */ React.createElement("div", { className: "p-4", style: UI_CONSTANTS.CARD_STYLE }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-center mb-3" }, "\u{1F3A8} \u0422\u0435\u043C\u044B"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, Object.entries(THEMES).map(([key, theme]) => {
  const isUnlocked = theme.unlocked || unlockedThemes.includes(key) || theme.unlockCondition && theme.unlockCondition(gameStats);
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      key,
      onClick: () => isUnlocked && onThemeChange(key),
      className: `p-3 rounded-xl border-2 transition-all duration-300 ${currentTheme === key ? "border-blue-400 bg-blue-50" : isUnlocked ? "border-gray-300 hover:border-gray-400" : "border-gray-200 opacity-50 cursor-not-allowed"}`,
      disabled: !isUnlocked
    },
    /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl mb-1" }, theme.icon), /* @__PURE__ */ React.createElement("div", { className: "font-bold text-sm" }, theme.name), !isUnlocked && theme.unlockCondition && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-500 mt-1" }, "\u{1F512} \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E"))
  );
})));
var BattleModal = ({ isOpen, battle, onAttack, onRunAway, onUseAbility, onClose, animations }) => {
  if (!isOpen || !battle) return null;
  const { monster, heroPower, activeItems } = battle;
  const canWin = heroPower >= monster.power;
  return /* @__PURE__ */ React.createElement(Modal, { isOpen, onClose: null, title: "\u2694\uFE0F \u0421\u0440\u0430\u0436\u0435\u043D\u0438\u0435!", showClose: false }, /* @__PURE__ */ React.createElement("div", { className: "text-center space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: `text-6xl ${animations.monster || "animate-bounce"}` }, monster.icon), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold" }, monster.name), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, monster.description), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center p-3 bg-gray-100 rounded-xl" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-500" }, "\u0412\u0430\u0448\u0430 \u0441\u0438\u043B\u0430"), /* @__PURE__ */ React.createElement("div", { className: `text-2xl font-bold text-blue-600 ${animations.heroPower || ""}` }, heroPower)), /* @__PURE__ */ React.createElement("div", { className: "text-2xl animate-pulse" }, "\u2694\uFE0F"), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-500" }, "\u0421\u0438\u043B\u0430 \u043C\u043E\u043D\u0441\u0442\u0440\u0430"), /* @__PURE__ */ React.createElement("div", { className: `text-2xl font-bold text-red-600 ${animations.monsterPower || ""}` }, monster.power))), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: onAttack,
      variant: canWin ? "success" : "danger",
      className: "w-full"
    },
    canWin ? "\u{1F389} \u0421\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F (\u041F\u043E\u0431\u0435\u0434\u0430!)" : "\u{1F480} \u0421\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F (\u041F\u043E\u0440\u0430\u0436\u0435\u043D\u0438\u0435!)"
  ), activeItems && activeItems.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold" }, "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u0441\u043F\u043E\u0441\u043E\u0431\u043D\u043E\u0441\u0442\u0438:"), activeItems.map((item, index) => /* @__PURE__ */ React.createElement(
    Button,
    {
      key: index,
      onClick: () => onUseAbility(item),
      variant: "legendary",
      size: "small",
      className: "w-full",
      disabled: item.cooldownRemaining > 0
    },
    item.activeAbility.name,
    " (",
    item.cooldownRemaining > 0 ? `${item.cooldownRemaining} \u0445\u043E\u0434\u043E\u0432` : "\u0413\u043E\u0442\u043E\u0432\u043E",
    ")"
  ))), /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: onRunAway,
      variant: "secondary",
      className: "w-full"
    },
    "\u{1F3C3} \u0423\u0431\u0435\u0436\u0430\u0442\u044C"
  ))));
};
var TutorialModal = ({ isOpen, onClose }) => /* @__PURE__ */ React.createElement(Modal, { isOpen, onClose, title: "\u{1F393} \u041A\u0430\u043A \u0438\u0433\u0440\u0430\u0442\u044C \u0432 \u041C\u0430\u043D\u0447\u043A\u0438\u043D" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4 text-sm" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, "\u{1F3AF} \u0426\u0435\u043B\u044C \u0438\u0433\u0440\u044B:"), /* @__PURE__ */ React.createElement("p", null, "\u0414\u043E\u0441\u0442\u0438\u0433\u043D\u0438\u0442\u0435 \u0432\u044B\u0441\u043E\u043A\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F, \u0441\u0440\u0430\u0436\u0430\u044F\u0441\u044C \u0441 \u043C\u043E\u043D\u0441\u0442\u0440\u0430\u043C\u0438 \u0438 \u0441\u043E\u0431\u0438\u0440\u0430\u044F \u0441\u043E\u043A\u0440\u043E\u0432\u0438\u0449\u0430!")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, "\u{1F6AA} \u0414\u0432\u0435\u0440\u0438 \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0439:"), /* @__PURE__ */ React.createElement("p", null, "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043A\u043E\u043B\u043E\u0434\u0443 \u0434\u0432\u0435\u0440\u0435\u0439, \u0447\u0442\u043E\u0431\u044B \u0432\u0441\u0442\u0440\u0435\u0442\u0438\u0442\u044C \u043C\u043E\u043D\u0441\u0442\u0440\u0430 \u0438\u043B\u0438 \u043D\u0430\u0439\u0442\u0438 \u0441\u043E\u043A\u0440\u043E\u0432\u0438\u0449\u0435.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, "\u2694\uFE0F \u0421\u0440\u0430\u0436\u0435\u043D\u0438\u044F:"), /* @__PURE__ */ React.createElement("p", null, "\u0412\u0430\u0448\u0430 \u0441\u0438\u043B\u0430 = \u0423\u0440\u043E\u0432\u0435\u043D\u044C + \u042D\u043A\u0438\u043F\u0438\u0440\u043E\u0432\u043A\u0430. \u0415\u0441\u043B\u0438 \u043E\u043D\u0430 \u0431\u043E\u043B\u044C\u0448\u0435 \u0441\u0438\u043B\u044B \u043C\u043E\u043D\u0441\u0442\u0440\u0430 - \u0432\u044B \u043F\u043E\u0431\u0435\u0436\u0434\u0430\u0435\u0442\u0435!")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, "\u{1F48E} \u0421\u043E\u043A\u0440\u043E\u0432\u0438\u0449\u0430:"), /* @__PURE__ */ React.createElement("p", null, "\u041F\u043E\u0441\u043B\u0435 \u043F\u043E\u0431\u0435\u0434\u044B \u043D\u0430\u0434 \u043C\u043E\u043D\u0441\u0442\u0440\u043E\u043C \u043C\u043E\u0436\u0435\u0442\u0435 \u0432\u0437\u044F\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0441\u043E\u043A\u0440\u043E\u0432\u0438\u0449. \u042D\u043A\u0438\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B, \u043D\u0430\u0436\u0430\u0432 \u043D\u0430 \u043D\u0438\u0445 \u0432 \u0440\u0443\u043A\u0435.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, "\u{1F3AF} \u0417\u0430\u0434\u0430\u043D\u0438\u044F:"), /* @__PURE__ */ React.createElement("p", null, "\u0412\u044B\u043F\u043E\u043B\u043D\u044F\u0439\u0442\u0435 \u043C\u0438\u043D\u0438-\u0437\u0430\u0434\u0430\u043D\u0438\u044F \u0434\u043B\u044F \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043D\u0430\u0433\u0440\u0430\u0434!")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, "\u26A1 \u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u0441\u043F\u043E\u0441\u043E\u0431\u043D\u043E\u0441\u0442\u0438:"), /* @__PURE__ */ React.createElement("p", null, "\u041D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B \u0438\u043C\u0435\u044E\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u0441\u043F\u043E\u0441\u043E\u0431\u043D\u043E\u0441\u0442\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043C\u043E\u0436\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0432 \u0431\u043E\u044E.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, "\u{1F3C3} \u041F\u043E\u0431\u0435\u0433:"), /* @__PURE__ */ React.createElement("p", null, "\u0415\u0441\u043B\u0438 \u043C\u043E\u043D\u0441\u0442\u0440 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u0438\u043B\u0435\u043D, \u043C\u043E\u0436\u0435\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u0430\u0442\u044C\u0441\u044F \u0443\u0431\u0435\u0436\u0430\u0442\u044C, \u043D\u043E \u044D\u0442\u043E \u043D\u0435 \u0432\u0441\u0435\u0433\u0434\u0430 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0441\u044F!"))));
var VictoryModal = ({ isOpen, onClose, monster, rewards, isCritical }) => /* @__PURE__ */ React.createElement(Modal, { isOpen, onClose, title: isCritical ? "\u{1F4A5} \u041A\u0420\u0418\u0422\u0418\u0427\u0415\u0421\u041A\u0410\u042F \u041F\u041E\u0411\u0415\u0414\u0410!" : "\u{1F389} \u041F\u043E\u0431\u0435\u0434\u0430!" }, /* @__PURE__ */ React.createElement("div", { className: "text-center space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: `text-6xl ${isCritical ? "animate-spin" : "animate-bounce"}` }, isCritical ? "\u26A1" : monster?.icon), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold" }, isCritical ? "\u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0443\u0434\u0430\u0440!" : `\u0412\u044B \u043F\u043E\u0431\u0435\u0434\u0438\u043B\u0438 ${monster?.name}!`), /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 p-4 rounded-lg" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold mb-2" }, "\u041D\u0430\u0433\u0440\u0430\u0434\u044B:"), /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, rewards?.level && /* @__PURE__ */ React.createElement("div", { className: "animate-pulse" }, "\u{1F3AF} +", rewards.level, " \u0443\u0440\u043E\u0432\u0435\u043D\u044C"), rewards?.gold && /* @__PURE__ */ React.createElement("div", { className: "animate-pulse" }, "\u{1F4B0} +", rewards.gold, " \u0437\u043E\u043B\u043E\u0442\u0430"), rewards?.experience && /* @__PURE__ */ React.createElement("div", { className: "animate-pulse" }, "\u2728 +", rewards.experience, " \u043E\u043F\u044B\u0442\u0430"), rewards?.health && /* @__PURE__ */ React.createElement("div", { className: "animate-pulse" }, "\u2764\uFE0F +", rewards.health, " \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F"))), /* @__PURE__ */ React.createElement(Button, { onClick: onClose, variant: "success", className: "animate-pulse" }, "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435")));
var DefeatModal = ({ isOpen, onClose, monster, isDodged }) => /* @__PURE__ */ React.createElement(Modal, { isOpen, onClose, title: isDodged ? "\u{1F4A8} \u0423\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435!" : "\u{1F480} \u041F\u043E\u0440\u0430\u0436\u0435\u043D\u0438\u0435" }, /* @__PURE__ */ React.createElement("div", { className: "text-center space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: `text-6xl ${isDodged ? "animate-ping" : "animate-bounce"}` }, isDodged ? "\u{1F4A8}" : monster?.icon), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold" }, isDodged ? "\u0412\u044B \u0443\u043A\u043B\u043E\u043D\u0438\u043B\u0438\u0441\u044C \u043E\u0442 \u0430\u0442\u0430\u043A\u0438!" : `${monster?.name} \u043E\u043A\u0430\u0437\u0430\u043B\u0441\u044F \u0441\u0438\u043B\u044C\u043D\u0435\u0435`), /* @__PURE__ */ React.createElement("div", { className: `p-4 rounded-lg ${isDodged ? "bg-blue-50" : "bg-red-50"}` }, /* @__PURE__ */ React.createElement("p", { className: isDodged ? "text-blue-700" : "text-red-700" }, isDodged ? "\u0411\u044B\u0441\u0442\u0440\u0430\u044F \u0440\u0435\u0430\u043A\u0446\u0438\u044F \u0441\u043F\u0430\u0441\u043B\u0430 \u0432\u0430\u0441!" : "\u0412\u044B \u043F\u043E\u0442\u0435\u0440\u044F\u043B\u0438 \u0447\u0430\u0441\u0442\u044C \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F, \u043D\u043E \u043D\u0435 \u0441\u0434\u0430\u0432\u0430\u0439\u0442\u0435\u0441\u044C!")), /* @__PURE__ */ React.createElement(Button, { onClick: onClose, variant: isDodged ? "primary" : "danger" }, isDodged ? "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C" : "\u041F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430")));
var PlayerHand = ({ hand, onCardClick, handLimit, animations }) => {
  if (!hand || hand.length === 0) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "p-4", style: UI_CONSTANTS.CARD_STYLE }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-center mb-3" }, "\u{1F0CF} \u0420\u0443\u043A\u0430 (", hand.length, "/", handLimit, ")"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, hand.map((card, index) => /* @__PURE__ */ React.createElement(
    Card,
    {
      key: card.id || index,
      card,
      onClick: () => onCardClick(card),
      className: "border-blue-200 hover:border-blue-400",
      animation: animations[`card-${index}`]
    }
  ))));
};
var HeroProfile = ({ hero, calculateHeroPower, theme, animations }) => {
  const healthPercent = hero.health / hero.maxHealth * 100;
  const currentTheme = THEMES[theme] || THEMES.classic;
  return /* @__PURE__ */ React.createElement("div", { className: "p-3 flex-shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "p-4", style: UI_CONSTANTS.CARD_STYLE }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-4" }, /* @__PURE__ */ React.createElement("div", { className: `w-16 h-16 bg-gradient-to-br ${currentTheme.cardGradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg ${animations.hero || ""}` }, currentTheme.heroIcon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold" }, hero.name), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("div", { className: `bg-gradient-to-r ${currentTheme.cardGradient} text-white px-3 py-1 rounded-full text-xs font-bold` }, "\u0423\u0440\u043E\u0432\u0435\u043D\u044C ", hero.level), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u0421\u0438\u043B\u0430: ", calculateHeroPower())), hero.cursed && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-red-600 animate-pulse" }, "\u{1F608} \u041F\u0440\u043E\u043A\u043B\u044F\u0442 (", hero.curseCounter, " \u0445\u043E\u0434\u043E\u0432)"))), /* @__PURE__ */ React.createElement("div", { className: "text-right space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-yellow-500" }, "\u{1F4B0}"), /* @__PURE__ */ React.createElement("span", { className: `font-bold text-sm ${animations.gold || ""}` }, hero.gold)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "\u2764\uFE0F"), /* @__PURE__ */ React.createElement("span", { className: `font-bold text-sm ${animations.health || ""}` }, hero.health, "/", hero.maxHealth)), hero.winStreak > 0 && /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-orange-500" }, "\u{1F525}"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm" }, hero.winStreak)))), /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-red-500" }, "\u2764\uFE0F"), /* @__PURE__ */ React.createElement("div", { className: "flex-1 bg-gray-200 rounded-full h-3 overflow-hidden" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "bg-gradient-to-r from-red-400 to-pink-400 h-full rounded-full transition-all duration-500",
      style: { width: `${healthPercent}%` }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, hero.health, "/", hero.maxHealth)))));
};
var InventoryTab = ({ hero, onEquipItem, onResetProgress, onThemeChange, currentTheme, unlockedThemes, gameStats, allTimeStats }) => {
  return /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-center" }, "\u{1F392} \u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C"), /* @__PURE__ */ React.createElement("div", { className: "p-4", style: UI_CONSTANTS.CARD_STYLE }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold mb-3" }, "\u2694\uFE0F \u042D\u043A\u0438\u043F\u0438\u0440\u043E\u0432\u043A\u0430"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, Object.entries(hero.equipped || {}).map(([slot, item]) => /* @__PURE__ */ React.createElement("div", { key: slot, className: "p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-500 mb-1" }, slot === "weapon" ? "\u{1F5E1}\uFE0F \u041E\u0440\u0443\u0436\u0438\u0435" : slot === "armor" ? "\u{1F6E1}\uFE0F \u0411\u0440\u043E\u043D\u044F" : slot === "boots" ? "\u{1F45F} \u041E\u0431\u0443\u0432\u044C" : slot === "accessory" ? "\u{1F48D} \u0410\u043A\u0441\u0435\u0441\u0441\u0443\u0430\u0440" : slot), item ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg mb-1" }, item.icon), /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold" }, item.name), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-blue-600" }, "+", item.power), item.activeAbility && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-purple-600" }, "\u26A1 \u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F")) : /* @__PURE__ */ React.createElement("div", { className: "text-gray-400 text-sm" }, "\u041F\u0443\u0441\u0442\u043E"))))), /* @__PURE__ */ React.createElement("div", { className: "mt-4 p-3 bg-blue-50 rounded-xl" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold mb-2" }, "\u{1F4CA} \u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0438"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 text-sm" }, hero.criticalChance && /* @__PURE__ */ React.createElement("div", null, "\u{1F3AF} \u041A\u0440\u0438\u0442: ", Math.round(hero.criticalChance * 100), "%"), hero.dodgeChance && /* @__PURE__ */ React.createElement("div", null, "\u{1F4A8} \u0423\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435: ", Math.round(hero.dodgeChance * 100), "%"), hero.goldMultiplier && hero.goldMultiplier > 1 && /* @__PURE__ */ React.createElement("div", null, "\u{1F4B0} \u0417\u043E\u043B\u043E\u0442\u043E: +", Math.round((hero.goldMultiplier - 1) * 100), "%"), hero.regeneration && /* @__PURE__ */ React.createElement("div", null, "\u{1F504} \u0420\u0435\u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F: +", hero.regeneration), hero.magicShield && /* @__PURE__ */ React.createElement("div", null, "\u{1F6E1}\uFE0F \u041C\u0430\u0433. \u0449\u0438\u0442: +", hero.magicShield), hero.luck && /* @__PURE__ */ React.createElement("div", null, "\u{1F340} \u0423\u0434\u0430\u0447\u0430: +", hero.luck)))), /* @__PURE__ */ React.createElement(
    ThemeSelector,
    {
      currentTheme,
      onThemeChange,
      unlockedThemes,
      gameStats
    }
  ), /* @__PURE__ */ React.createElement(Leaderboard, { gameStats, allTimeStats }), /* @__PURE__ */ React.createElement("div", { className: "p-4", style: UI_CONSTANTS.CARD_STYLE }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold mb-3" }, "\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"), /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: onResetProgress,
      variant: "danger",
      className: "w-full"
    },
    "\u{1F504} \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441"
  ), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500 mt-2 text-center" }, "\u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C")));
};
var AchievementsTab = ({ gameStats, unlockedAchievements, hero }) => {
  return /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-center" }, "\u{1F3C6} \u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F"), /* @__PURE__ */ React.createElement("div", { className: "p-4", style: UI_CONSTANTS.CARD_STYLE }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold mb-3" }, "\u{1F4CA} \u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-green-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-green-600" }, gameStats.victories), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u041F\u043E\u0431\u0435\u0434\u044B")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-red-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-red-600" }, gameStats.defeats), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u041F\u043E\u0440\u0430\u0436\u0435\u043D\u0438\u044F")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-blue-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-blue-600" }, gameStats.treasuresCollected), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u0421\u043E\u043A\u0440\u043E\u0432\u0438\u0449\u0430")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-purple-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-purple-600" }, gameStats.maxLevel), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u041C\u0430\u043A\u0441. \u0443\u0440\u043E\u0432\u0435\u043D\u044C"))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-yellow-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-yellow-600" }, gameStats.maxWinStreak || 0), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u041B\u0443\u0447\u0448\u0430\u044F \u0441\u0435\u0440\u0438\u044F")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-2 bg-orange-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-orange-600" }, gameStats.criticalHits || 0), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600" }, "\u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0443\u0434\u0430\u0440\u044B")))), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, ACHIEVEMENTS.map((achievement) => {
    const isUnlocked = unlockedAchievements.includes(achievement.id);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: achievement.id,
        className: `p-4 rounded-xl transition-all duration-300 ${isUnlocked ? "bg-green-50 border-green-200 animate-pulse" : "bg-gray-50 border-gray-200"} border`
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement("div", { className: `text-2xl ${isUnlocked ? "animate-bounce" : "grayscale opacity-50"}` }, achievement.icon), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: `font-bold ${isUnlocked ? "text-green-800" : "text-gray-600"}` }, achievement.name), /* @__PURE__ */ React.createElement("div", { className: `text-sm ${isUnlocked ? "text-green-600" : "text-gray-500"}` }, achievement.description)), isUnlocked && /* @__PURE__ */ React.createElement("div", { className: "text-green-500 text-xl animate-spin" }, "\u2705"))
    );
  })));
};
var MunchkinCardGame = () => {
  const { useStoredState } = hatch;
  const handleStorageError = useCallback((error) => {
    console.warn("localStorage error:", error);
  }, []);
  const [difficulty, setDifficulty] = useStoredState("munchkinDifficulty", null, handleStorageError);
  const [currentTheme, setCurrentTheme] = useStoredState("munchkinTheme", "classic", handleStorageError);
  const [unlockedThemes, setUnlockedThemes] = useStoredState("munchkinUnlockedThemes", [], handleStorageError);
  const [hero, setHero] = useStoredState("munchkinHero", {
    name: "\u041D\u043E\u0432\u0438\u0447\u043E\u043A",
    level: 1,
    health: 100,
    maxHealth: 100,
    gold: 50,
    experience: 0,
    hand: [],
    equipped: { weapon: null, armor: null, boots: null, accessory: null },
    curses: [],
    winStreak: 0,
    criticalChance: 0,
    dodgeChance: 0,
    goldMultiplier: 1,
    regeneration: 0,
    magicShield: 0,
    luck: 0,
    cursed: false,
    curseCounter: 0
  }, handleStorageError);
  const [gameStats, setGameStats] = useLocalStorage("munchkinStats", {
    victories: 0,
    defeats: 0,
    treasuresCollected: 0,
    maxLevel: 1,
    gamesPlayed: 0,
    maxWinStreak: 0,
    criticalHits: 0,
    totalGoldEarned: 0,
    monstersKilled: 0,
    questsCompleted: 0
  }, handleStorageError);
  const [allTimeStats, setAllTimeStats] = useLocalStorage("munchkinAllTimeStats", {
    bestLevel: 1,
    maxGold: 50,
    totalVictories: 0,
    maxWinStreak: 0,
    totalPlayTime: 0,
    gamesPlayed: 0
  }, handleStorageError);
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage("munchkinAchievements", [], handleStorageError);
  const [quests, setQuests] = useLocalStorage("munchkinQuests", [], handleStorageError);
  const [gameState, setGameState] = useState({
    currentEvent: null,
    battleMode: false,
    canDrawTreasure: false,
    showTutorial: false,
    showVictoryModal: false,
    showDefeatModal: false,
    showLevelUpModal: false,
    showRandomEventModal: false,
    lastBattle: null,
    lastRewards: null,
    lastEvent: null,
    pendingUpgrades: [],
    isCritical: false,
    isDodged: false,
    sessionStartTime: Date.now()
  });
  const [currentTab, setCurrentTab] = useState("main");
  const [isLoading, setIsLoading] = useState(true);
  const { notifications, addNotification } = useNotifications();
  const { animations, triggerAnimation } = useAnimations();
  const currentThemeData = THEMES[currentTheme] || THEMES.classic;
  const difficultyData = DIFFICULTY_MODES[difficulty] || DIFFICULTY_MODES.normal;
  useEffect(() => {
    if (!hero.equipped) {
      setHero((prev) => ({
        ...prev,
        equipped: { weapon: null, armor: null, boots: null, accessory: null },
        hand: prev.hand || [],
        curses: prev.curses || [],
        winStreak: prev.winStreak || 0,
        criticalChance: prev.criticalChance || 0,
        dodgeChance: prev.dodgeChance || 0,
        goldMultiplier: prev.goldMultiplier || 1,
        regeneration: prev.regeneration || 0,
        magicShield: prev.magicShield || 0,
        luck: prev.luck || 0,
        cursed: prev.cursed || false,
        curseCounter: prev.curseCounter || 0
      }));
    }
    setIsLoading(false);
  }, [hero.equipped, setHero]);
  useEffect(() => {
    if (quests.length === 0) {
      const initialQuests = shuffleArray(MINI_QUESTS).slice(0, 2).map((quest) => ({
        ...quest,
        active: true,
        completed: false,
        progress: 0
      }));
      setQuests(initialQuests);
    }
  }, [quests.length, setQuests]);
  useEffect(() => {
    const interval = setInterval(() => {
      const playTime = Math.floor((Date.now() - gameState.sessionStartTime) / 1e3);
      setAllTimeStats((prev) => ({
        ...prev,
        totalPlayTime: prev.totalPlayTime + 1
      }));
    }, 1e3);
    return () => clearInterval(interval);
  }, [gameState.sessionStartTime, setAllTimeStats]);
  useEffect(() => {
    ACHIEVEMENTS.forEach((achievement) => {
      if (!unlockedAchievements.includes(achievement.id) && achievement.condition(gameStats, hero)) {
        setUnlockedAchievements((prev) => [...prev, achievement.id]);
        addNotification(`\u{1F3C6} \u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0435: ${achievement.name}`, "success");
        triggerAnimation("achievement", "animate-bounce");
      }
    });
  }, [gameStats, hero, unlockedAchievements, setUnlockedAchievements, addNotification, triggerAnimation]);
  useEffect(() => {
    Object.entries(THEMES).forEach(([key, theme]) => {
      if (!unlockedThemes.includes(key) && theme.unlockCondition && theme.unlockCondition(gameStats)) {
        setUnlockedThemes((prev) => [...prev, key]);
        addNotification(`\u{1F3A8} \u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u0442\u0435\u043C\u0430: ${theme.name}`, "success");
      }
    });
  }, [gameStats, unlockedThemes, setUnlockedThemes, addNotification]);
  useEffect(() => {
    if (hero.cursed && hero.curseCounter > 0) {
      const timer = setTimeout(() => {
        setHero((prev) => ({
          ...prev,
          curseCounter: prev.curseCounter - 1,
          cursed: prev.curseCounter <= 1 ? false : true
        }));
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [hero.cursed, hero.curseCounter, setHero]);
  const calculateHeroPower = useCallback(() => {
    let totalPower = hero.level;
    if (hero.equipped) {
      Object.values(hero.equipped).forEach((item) => {
        if (item && item.power) {
          totalPower += item.power;
        }
      });
    }
    if (hero.cursed) {
      totalPower = Math.max(1, totalPower - 2);
    }
    if (hero.magicShield) {
      totalPower += hero.magicShield;
    }
    return Math.max(1, totalPower);
  }, [hero.level, hero.equipped, hero.cursed, hero.magicShield]);
  const drawDoorCard = useCallback(() => {
    if (Math.random() < GAME_CONSTANTS.RANDOM_EVENT_CHANCE) {
      const randomEvent = getRandomElement(RANDOM_EVENTS);
      setGameState((prev) => ({
        ...prev,
        showRandomEventModal: true,
        lastEvent: randomEvent
      }));
      const newHero = randomEvent.effect(hero);
      setHero(newHero);
      addNotification(`\u{1F3B2} ${randomEvent.name}`, randomEvent.type === "positive" ? "success" : "warning");
      return;
    }
    if (Math.random() < GAME_CONSTANTS.EASTER_EGG_CHANCE) {
      const easterEgg = getRandomElement(EASTER_EGGS);
      addNotification(easterEgg.message, "info");
      if (easterEgg.effect) {
        const newHero = easterEgg.effect(hero);
        setHero(newHero);
      }
    }
    const allMonsters = [...MONSTERS, ...ACTIVE_ITEMS.filter((item) => item.type === "monster")];
    const randomMonster = getRandomElement(allMonsters);
    const scaledMonster = {
      ...randomMonster,
      power: Math.ceil(randomMonster.power * difficultyData.enemyPowerMultiplier),
      health: Math.ceil(randomMonster.health * difficultyData.enemyPowerMultiplier)
    };
    addNotification(`\u{1F6AA} \u0412\u0441\u0442\u0440\u0435\u0442\u0438\u043B ${scaledMonster.name}!`, "info");
    const heroPower = calculateHeroPower();
    const activeItems = Object.values(hero.equipped).filter((item) => item && item.activeAbility);
    setGameState((prev) => ({
      ...prev,
      battleMode: true,
      currentEvent: {
        type: "monster",
        data: {
          ...scaledMonster,
          currentHealth: scaledMonster.health
        }
      },
      lastBattle: {
        monster: scaledMonster,
        heroPower,
        activeItems: activeItems.map((item) => ({
          ...item,
          cooldownRemaining: item.cooldownRemaining || 0
        }))
      }
    }));
    triggerAnimation("monster", "animate-shake");
  }, [hero, calculateHeroPower, addNotification, setHero, difficultyData, triggerAnimation]);
  const drawTreasureCard = useCallback(() => {
    if (!gameState.canDrawTreasure) {
      addNotification("\u041D\u0443\u0436\u043D\u043E \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u044C \u043C\u043E\u043D\u0441\u0442\u0440\u0430!", "warning");
      return;
    }
    const allTreasures = [...TREASURES, ...ACTIVE_ITEMS];
    const randomTreasure = getRandomElement(allTreasures);
    addNotification(`\u{1F48E} \u041F\u043E\u043B\u0443\u0447\u0438\u043B ${randomTreasure.name}!`, "success");
    if (hero.hand.length < GAME_CONSTANTS.HAND_LIMIT) {
      setHero((prev) => ({
        ...prev,
        hand: [...prev.hand, { ...randomTreasure, id: generateId() }]
      }));
    }
    setGameState((prev) => ({
      ...prev,
      canDrawTreasure: false
    }));
    setGameStats((prev) => ({
      ...prev,
      treasuresCollected: prev.treasuresCollected + 1
    }));
    triggerAnimation("treasure", "animate-bounce");
  }, [gameState.canDrawTreasure, hero.hand.length, setHero, setGameStats, addNotification, triggerAnimation]);
  const updateQuests = useCallback((action, data) => {
    setQuests((prev) => prev.map((quest) => {
      if (!quest.active || quest.completed) return quest;
      let shouldUpdate = false;
      if (action === "victory" && quest.condition === "winStreak") {
        shouldUpdate = true;
      } else if (action === "victory" && typeof quest.condition === "function") {
        shouldUpdate = quest.condition(gameStats, data);
      } else if (action === "treasure" && quest.condition === "treasures") {
        shouldUpdate = true;
      }
      if (shouldUpdate) {
        const newProgress = (quest.progress || 0) + 1;
        return {
          ...quest,
          progress: newProgress,
          completed: newProgress >= quest.target
        };
      }
      return quest;
    }));
  }, [setQuests, gameStats]);
  const handleBattle = useCallback((shouldFight) => {
    if (!gameState.currentEvent) return;
    const monster = gameState.currentEvent.data;
    const heroPower = calculateHeroPower();
    if (shouldFight) {
      const dodgeChance = hero.dodgeChance || 0;
      const isDodged = Math.random() < dodgeChance;
      if (isDodged) {
        addNotification("\u{1F4A8} \u0412\u044B \u0443\u043A\u043B\u043E\u043D\u0438\u043B\u0438\u0441\u044C \u043E\u0442 \u0430\u0442\u0430\u043A\u0438!", "success");
        setGameState((prev) => ({
          ...prev,
          battleMode: false,
          currentEvent: null,
          showDefeatModal: true,
          isDodged: true
        }));
        return;
      }
      if (heroPower >= monster.power) {
        const criticalChance = hero.criticalChance || 0;
        const isCritical = Math.random() < criticalChance;
        if (isCritical) {
          setGameStats((prev) => ({
            ...prev,
            criticalHits: prev.criticalHits + 1
          }));
          addNotification("\u{1F4A5} \u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0443\u0434\u0430\u0440!", "success");
          triggerAnimation("critical", "animate-pulse");
        }
        const levelUp = Math.random() < difficultyData.levelUpChance;
        const baseGold = monster.treasure * 10 + Math.floor(Math.random() * 20);
        const goldReward = Math.floor(baseGold * (hero.goldMultiplier || 1) * difficultyData.goldMultiplier);
        const experienceReward = monster.level * 5;
        const rewards = {
          level: levelUp ? 1 : 0,
          gold: goldReward,
          experience: experienceReward
        };
        const newWinStreak = (hero.winStreak || 0) + 1;
        setHero((prev) => ({
          ...prev,
          level: levelUp ? prev.level + 1 : prev.level,
          gold: prev.gold + goldReward,
          maxHealth: levelUp ? prev.maxHealth + 10 : prev.maxHealth,
          health: levelUp ? prev.health + 10 : prev.health,
          winStreak: newWinStreak,
          experience: (prev.experience || 0) + experienceReward,
          health: Math.min(prev.maxHealth, prev.health + (prev.regeneration || 0))
        }));
        setGameStats((prev) => ({
          ...prev,
          victories: prev.victories + 1,
          maxLevel: Math.max(prev.maxLevel, hero.level + (levelUp ? 1 : 0)),
          maxWinStreak: Math.max(prev.maxWinStreak, newWinStreak),
          totalGoldEarned: prev.totalGoldEarned + goldReward,
          monstersKilled: prev.monstersKilled + 1
        }));
        setAllTimeStats((prev) => ({
          ...prev,
          totalVictories: prev.totalVictories + 1,
          maxGold: Math.max(prev.maxGold, hero.gold + goldReward),
          bestLevel: Math.max(prev.bestLevel, hero.level + (levelUp ? 1 : 0)),
          maxWinStreak: Math.max(prev.maxWinStreak, newWinStreak)
        }));
        updateQuests("victory", monster);
        setGameState((prev) => ({
          ...prev,
          battleMode: false,
          currentEvent: null,
          canDrawTreasure: true,
          showVictoryModal: true,
          lastRewards: rewards,
          isCritical,
          showLevelUpModal: levelUp,
          pendingUpgrades: levelUp ? shuffleArray(LEVEL_UP_UPGRADES).slice(0, 3) : []
        }));
        triggerAnimation("victory", "animate-bounce");
        triggerAnimation("gold", "animate-pulse");
      } else {
        const healthLoss = Math.min(20, hero.health - 1);
        setHero((prev) => ({
          ...prev,
          health: Math.max(1, prev.health - healthLoss),
          winStreak: 0
        }));
        setGameStats((prev) => ({
          ...prev,
          defeats: prev.defeats + 1
        }));
        setGameState((prev) => ({
          ...prev,
          battleMode: false,
          currentEvent: null,
          showDefeatModal: true,
          isDodged: false
        }));
        triggerAnimation("defeat", "animate-shake");
        triggerAnimation("health", "animate-pulse");
      }
    } else {
      const escapeSuccess = Math.random() < 0.7;
      if (escapeSuccess) {
        addNotification("\u{1F3C3} \u0423\u0434\u0430\u043B\u043E\u0441\u044C \u0443\u0431\u0435\u0436\u0430\u0442\u044C!", "success");
      } else {
        addNotification("\u{1F494} \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0443\u0431\u0435\u0436\u0430\u0442\u044C! \u041F\u043E\u043B\u0443\u0447\u0435\u043D \u0443\u0440\u043E\u043D", "error");
        const healthLoss = Math.min(10, hero.health - 1);
        setHero((prev) => ({
          ...prev,
          health: Math.max(1, prev.health - healthLoss),
          winStreak: 0
        }));
      }
      setGameState((prev) => ({
        ...prev,
        battleMode: false,
        currentEvent: null
      }));
    }
  }, [gameState.currentEvent, calculateHeroPower, hero, setHero, setGameStats, setAllTimeStats, addNotification, difficultyData, updateQuests, triggerAnimation]);
  const useActiveAbility = useCallback((item) => {
    if (!item.activeAbility || item.cooldownRemaining > 0) return;
    const monster = gameState.currentEvent.data;
    const ability = item.activeAbility;
    if (ability.damage) {
      const newHealth = Math.max(0, monster.currentHealth - ability.damage);
      setGameState((prev) => ({
        ...prev,
        currentEvent: {
          ...prev.currentEvent,
          data: { ...monster, currentHealth: newHealth }
        }
      }));
      addNotification(`\u26A1 ${ability.name} \u043D\u0430\u043D\u0435\u0441\u043B\u0430 ${ability.damage} \u0443\u0440\u043E\u043D\u0430!`, "success");
      if (newHealth <= 0) {
        handleBattle(true);
        return;
      }
    }
    if (ability.heal) {
      setHero((prev) => ({
        ...prev,
        health: Math.min(prev.maxHealth, prev.health + ability.heal)
      }));
      addNotification(`\u2728 ${ability.name} \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u043B\u0430 ${ability.heal} \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F!`, "success");
    }
    setHero((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [item.type]: {
          ...item,
          cooldownRemaining: ability.cooldown
        }
      }
    }));
    triggerAnimation("ability", "animate-pulse");
  }, [gameState.currentEvent, setGameState, setHero, addNotification, handleBattle, triggerAnimation]);
  const equipItem = useCallback((item) => {
    if (!item || !item.type) return;
    setHero((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [item.type]: item
      },
      hand: prev.hand.filter((handItem) => handItem.id !== item.id)
    }));
    addNotification(`\u2694\uFE0F \u042D\u043A\u0438\u043F\u0438\u0440\u043E\u0432\u0430\u043B ${item.name}!`, "success");
    triggerAnimation("equip", "animate-bounce");
  }, [setHero, addNotification, triggerAnimation]);
  const handleLevelUpgrade = useCallback((upgrade) => {
    const newHero = upgrade.effect(hero);
    setHero(newHero);
    addNotification(`\u{1F389} \u041F\u043E\u043B\u0443\u0447\u0435\u043D\u043E \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u0435: ${upgrade.name}!`, "success");
    setGameState((prev) => ({
      ...prev,
      showLevelUpModal: false,
      pendingUpgrades: []
    }));
  }, [hero, setHero, addNotification]);
  const completeQuest = useCallback((quest) => {
    setQuests((prev) => prev.map(
      (q) => q.id === quest.id ? { ...q, completed: true } : q
    ));
    if (quest.reward.gold) {
      setHero((prev) => ({ ...prev, gold: prev.gold + quest.reward.gold }));
    }
    if (quest.reward.health) {
      setHero((prev) => ({ ...prev, health: Math.min(prev.maxHealth, prev.health + quest.reward.health) }));
    }
    if (quest.reward.level) {
      setHero((prev) => ({ ...prev, level: prev.level + quest.reward.level }));
    }
    if (quest.reward.experience) {
      setHero((prev) => ({ ...prev, experience: (prev.experience || 0) + quest.reward.experience }));
    }
    setGameStats((prev) => ({
      ...prev,
      questsCompleted: prev.questsCompleted + 1
    }));
    addNotification(`\u2705 \u0417\u0430\u0434\u0430\u043D\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E: ${quest.name}!`, "success");
    const availableQuests = MINI_QUESTS.filter((q) => !quests.some((existing) => existing.id === q.id));
    if (availableQuests.length > 0) {
      const newQuest = {
        ...getRandomElement(availableQuests),
        active: true,
        completed: false,
        progress: 0
      };
      setQuests((prev) => [...prev, newQuest]);
    }
  }, [setQuests, setHero, setGameStats, addNotification, quests]);
  const resetProgress = useCallback(() => {
    if (window.confirm("\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0435\u0441\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441? \u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C.")) {
      const baseHealth = Math.floor(100 * difficultyData.healthMultiplier);
      const baseGold = Math.floor(50 * difficultyData.goldMultiplier);
      setHero({
        name: "\u041D\u043E\u0432\u0438\u0447\u043E\u043A",
        level: 1,
        health: baseHealth,
        maxHealth: baseHealth,
        gold: baseGold,
        experience: 0,
        hand: [],
        equipped: { weapon: null, armor: null, boots: null, accessory: null },
        curses: [],
        winStreak: 0,
        criticalChance: 0,
        dodgeChance: 0,
        goldMultiplier: 1,
        regeneration: 0,
        magicShield: 0,
        luck: 0,
        cursed: false,
        curseCounter: 0
      });
      setGameStats({
        victories: 0,
        defeats: 0,
        treasuresCollected: 0,
        maxLevel: 1,
        gamesPlayed: 0,
        maxWinStreak: 0,
        criticalHits: 0,
        totalGoldEarned: 0,
        monstersKilled: 0,
        questsCompleted: 0
      });
      setUnlockedAchievements([]);
      setQuests([]);
      setGameState({
        currentEvent: null,
        battleMode: false,
        canDrawTreasure: false,
        showTutorial: false,
        showVictoryModal: false,
        showDefeatModal: false,
        showLevelUpModal: false,
        showRandomEventModal: false,
        lastBattle: null,
        lastRewards: null,
        lastEvent: null,
        pendingUpgrades: [],
        isCritical: false,
        isDodged: false,
        sessionStartTime: Date.now()
      });
      addNotification("\u{1F504} \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0441\u0431\u0440\u043E\u0448\u0435\u043D", "info");
    }
  }, [setHero, setGameStats, setUnlockedAchievements, setQuests, addNotification, difficultyData]);
  const renderMainTab = () => /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-6" }, /* @__PURE__ */ React.createElement(QuestTracker, { quests, onQuestComplete: completeQuest }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-8 px-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-slate-700 mb-6" }, "\u{1F6AA} \u0414\u0432\u0435\u0440\u0438"), /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: gameState.battleMode ? void 0 : drawDoorCard,
      className: `relative w-40 h-56 mx-auto cursor-pointer transition-all duration-500 ${gameState.battleMode ? "opacity-50 cursor-not-allowed" : "hover:scale-105"} ${animations.doorDeck || ""}`,
      style: {
        background: `linear-gradient(135deg, ${currentThemeData.bgGradient.split(" ")[0]} 0%, ${currentThemeData.bgGradient.split(" ")[2]} 50%, ${currentThemeData.bgGradient.split(" ")[4]} 100%)`,
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(79, 70, 229, 0.15)"
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "relative z-20 h-full flex flex-col items-center justify-center text-slate-700" }, /* @__PURE__ */ React.createElement("div", { className: "text-4xl mb-3 animate-pulse" }, "\u{1F3AD}"), /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold" }, "\u041F\u0420\u0418\u041A\u041B\u042E\u0427\u0415\u041D\u0418\u042F"))
  )), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-slate-700 mb-6" }, "\u{1F48E} \u0421\u043E\u043A\u0440\u043E\u0432\u0438\u0449\u0430"), /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: drawTreasureCard,
      className: `relative w-40 h-56 mx-auto cursor-pointer transition-all duration-500 ${gameState.canDrawTreasure ? "hover:scale-105" : "opacity-60 cursor-not-allowed"} ${animations.treasureDeck || ""}`,
      style: {
        background: gameState.canDrawTreasure ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)" : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)",
        borderRadius: "16px"
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "relative z-20 h-full flex flex-col items-center justify-center text-slate-700" }, /* @__PURE__ */ React.createElement("div", { className: "text-4xl mb-3" }, gameState.canDrawTreasure ? "\u{1F48E}" : "\u{1F512}"), /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold" }, "\u0421\u041E\u041A\u0420\u041E\u0412\u0418\u0429\u0410"))
  ))), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: () => setGameState((prev) => ({ ...prev, showTutorial: true })),
      variant: "secondary",
      size: "small"
    },
    "\u{1F393} \u041A\u0430\u043A \u0438\u0433\u0440\u0430\u0442\u044C?"
  )), hero.hand && hero.hand.length > 0 && /* @__PURE__ */ React.createElement(
    PlayerHand,
    {
      hand: hero.hand,
      onCardClick: equipItem,
      handLimit: GAME_CONSTANTS.HAND_LIMIT,
      animations
    }
  ));
  if (!difficulty) {
    return /* @__PURE__ */ React.createElement("div", { className: `w-full h-full bg-gradient-to-br ${currentThemeData.bgGradient}` }, /* @__PURE__ */ React.createElement(DifficultySelector, { onSelect: setDifficulty }));
  }
  if (isLoading) {
    return /* @__PURE__ */ React.createElement(LoadingScreen, null);
  }
  return /* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement("div", { className: `w-full h-full max-h-screen relative flex flex-col overflow-hidden bg-gradient-to-br ${currentThemeData.bgGradient}` }, /* @__PURE__ */ React.createElement(Notifications, { notifications }), /* @__PURE__ */ React.createElement(
    BattleModal,
    {
      isOpen: gameState.battleMode,
      battle: gameState.lastBattle,
      onAttack: () => handleBattle(true),
      onRunAway: () => handleBattle(false),
      onUseAbility: useActiveAbility,
      onClose: () => setGameState((prev) => ({ ...prev, battleMode: false })),
      animations
    }
  ), /* @__PURE__ */ React.createElement(
    LevelUpModal,
    {
      isOpen: gameState.showLevelUpModal,
      onClose: () => setGameState((prev) => ({ ...prev, showLevelUpModal: false })),
      onSelectUpgrade: handleLevelUpgrade,
      upgrades: gameState.pendingUpgrades
    }
  ), /* @__PURE__ */ React.createElement(
    RandomEventModal,
    {
      isOpen: gameState.showRandomEventModal,
      onClose: () => setGameState((prev) => ({ ...prev, showRandomEventModal: false })),
      event: gameState.lastEvent
    }
  ), /* @__PURE__ */ React.createElement(
    TutorialModal,
    {
      isOpen: gameState.showTutorial,
      onClose: () => setGameState((prev) => ({ ...prev, showTutorial: false }))
    }
  ), /* @__PURE__ */ React.createElement(
    VictoryModal,
    {
      isOpen: gameState.showVictoryModal,
      onClose: () => setGameState((prev) => ({ ...prev, showVictoryModal: false })),
      monster: gameState.lastBattle?.monster,
      rewards: gameState.lastRewards,
      isCritical: gameState.isCritical
    }
  ), /* @__PURE__ */ React.createElement(
    DefeatModal,
    {
      isOpen: gameState.showDefeatModal,
      onClose: () => setGameState((prev) => ({ ...prev, showDefeatModal: false })),
      monster: gameState.lastBattle?.monster,
      isDodged: gameState.isDodged
    }
  ), /* @__PURE__ */ React.createElement(
    HeroProfile,
    {
      hero,
      calculateHeroPower,
      theme: currentTheme,
      animations
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-auto" }, currentTab === "main" && renderMainTab(), currentTab === "inventory" && /* @__PURE__ */ React.createElement(
    InventoryTab,
    {
      hero,
      onEquipItem: equipItem,
      onResetProgress: resetProgress,
      onThemeChange: setCurrentTheme,
      currentTheme,
      unlockedThemes,
      gameStats,
      allTimeStats
    }
  ), currentTab === "achievements" && /* @__PURE__ */ React.createElement(
    AchievementsTab,
    {
      gameStats,
      unlockedAchievements,
      hero
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "p-2 flex-shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "py-2 px-4", style: UI_CONSTANTS.CARD_STYLE }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-around items-center" }, [
    { id: "main", icon: "\u{1F0CF}", name: "\u0418\u0433\u0440\u0430" },
    { id: "inventory", icon: "\u{1F392}", name: "\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C" },
    { id: "achievements", icon: "\u{1F3C6}", name: "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F" }
  ].map((tab) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: tab.id,
      onClick: () => setCurrentTab(tab.id),
      className: `relative flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${currentTab === tab.id ? `bg-gradient-to-r ${currentThemeData.cardGradient} text-white scale-110 shadow-lg` : "text-gray-600 hover:bg-gray-100"}`
    },
    /* @__PURE__ */ React.createElement("div", { className: "text-lg" }, tab.icon),
    /* @__PURE__ */ React.createElement("div", { className: "text-xs mt-1" }, tab.name),
    tab.id === "achievements" && unlockedAchievements.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse" }, unlockedAchievements.length)
  )))))));
};
var stdin_default = MunchkinCardGame;
export {
  stdin_default as default
};
