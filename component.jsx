import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ==================== CONSTANTS ====================
const GAME_CONSTANTS = {
  HAND_LIMIT: 5,
  NOTIFICATIONS_LIMIT: 3,
  NOTIFICATION_DURATION: 3000,
  ESCAPE_SUCCESS_THRESHOLD: 5,
  CRITICAL_HEALTH_THRESHOLD: 0.3,
  ENERGY_REGEN_INTERVAL: 30000,
  AUTO_SAVE_INTERVAL: 10000,
  RANDOM_EVENT_CHANCE: 0.2,
  EASTER_EGG_CHANCE: 0.05,
  QUEST_COMPLETION_REWARD: 50,
};

const UI_CONSTANTS = {
  COLORS: {
    primary: 'from-blue-400 to-violet-400',
    success: 'from-green-400 to-emerald-400',
    danger: 'from-red-400 to-pink-400',
    warning: 'from-orange-400 to-yellow-400',
    legendary: 'from-yellow-400 to-orange-400',
  },
  CARD_STYLE: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px'
  },
  BREAKPOINTS: {
    mobile: '768px',
    tablet: '1024px',
  }
};

const DIFFICULTY_MODES = {
  easy: {
    name: 'Легкий',
    icon: '🟢',
    description: 'Для новичков - больше здоровья и золота',
    healthMultiplier: 1.5,
    goldMultiplier: 1.5,
    enemyPowerMultiplier: 0.8,
    levelUpChance: 0.4,
  },
  normal: {
    name: 'Нормальный',
    icon: '🟡',
    description: 'Сбалансированный опыт',
    healthMultiplier: 1.0,
    goldMultiplier: 1.0,
    enemyPowerMultiplier: 1.0,
    levelUpChance: 0.3,
  },
  hardcore: {
    name: 'Хардкор',
    icon: '🔴',
    description: 'Для экспертов - меньше здоровья, сильнее враги',
    healthMultiplier: 0.7,
    goldMultiplier: 0.8,
    enemyPowerMultiplier: 1.3,
    levelUpChance: 0.2,
  }
};

const THEMES = {
  classic: {
    name: 'Классическая',
    icon: '🏰',
    unlocked: true,
    heroIcon: '🤴',
    bgGradient: 'from-slate-50 via-blue-50 to-violet-50',
    cardGradient: 'from-blue-400 to-violet-400',
  },
  dark: {
    name: 'Тёмная',
    icon: '🌙',
    unlocked: false,
    unlockCondition: (stats) => stats.victories >= 5,
    heroIcon: '🧙‍♂️',
    bgGradient: 'from-gray-900 via-purple-900 to-indigo-900',
    cardGradient: 'from-purple-500 to-indigo-500',
  },
  fire: {
    name: 'Огненная',
    icon: '🔥',
    unlocked: false,
    unlockCondition: (stats) => stats.maxLevel >= 5,
    heroIcon: '🔥',
    bgGradient: 'from-red-100 via-orange-100 to-yellow-100',
    cardGradient: 'from-red-400 to-orange-400',
  },
  nature: {
    name: 'Природная',
    icon: '🌿',
    unlocked: false,
    unlockCondition: (stats) => stats.treasuresCollected >= 15,
    heroIcon: '🧚‍♀️',
    bgGradient: 'from-green-100 via-emerald-100 to-teal-100',
    cardGradient: 'from-green-400 to-teal-400',
  }
};

// ==================== GAME DATA ====================
const MONSTERS = [
  { 
    id: 1, 
    name: 'Гоблин', 
    icon: '👹', 
    level: 1, 
    power: 2, 
    treasure: 1, 
    health: 15,
    description: 'Маленький и злобный',
    criticalChance: 0.1,
  },
  { 
    id: 2, 
    name: 'Орк', 
    icon: '👺', 
    level: 3, 
    power: 4, 
    treasure: 2, 
    health: 30,
    description: 'Сильный и жестокий',
    criticalChance: 0.15,
  },
  { 
    id: 3, 
    name: 'Дракон', 
    icon: '🐉', 
    level: 8, 
    power: 12, 
    treasure: 4, 
    health: 80,
    description: 'Могущественный и опасный',
    criticalChance: 0.2,
  },
  { 
    id: 4, 
    name: 'Скелет', 
    icon: '💀', 
    level: 2, 
    power: 3, 
    treasure: 1, 
    health: 20,
    description: 'Нежить из подземелий',
    criticalChance: 0.05,
  },
  { 
    id: 5, 
    name: 'Тролль', 
    icon: '🧌', 
    level: 5, 
    power: 8, 
    treasure: 3, 
    health: 50,
    description: 'Огромный и регенерирующий',
    criticalChance: 0.12,
  },
  { 
    id: 6, 
    name: 'Призрак', 
    icon: '👻', 
    level: 4, 
    power: 6, 
    treasure: 2, 
    health: 25,
    description: 'Эфемерный и таинственный',
    criticalChance: 0.25,
  }
];

const TREASURES = [
  { 
    id: 1, 
    name: 'Меч', 
    icon: '⚔️', 
    type: 'weapon', 
    power: 3, 
    rarity: 'common',
    description: 'Острый клинок',
    price: 20,
  },
  { 
    id: 2, 
    name: 'Щит', 
    icon: '🛡️', 
    type: 'armor', 
    power: 2, 
    rarity: 'common',
    description: 'Крепкая защита',
    price: 15,
  },
  { 
    id: 3, 
    name: 'Сапоги', 
    icon: '👢', 
    type: 'boots', 
    power: 1, 
    rarity: 'common',
    description: 'Быстрые ноги',
    price: 10,
  },
  { 
    id: 4, 
    name: 'Магический посох', 
    icon: '🪄', 
    type: 'weapon', 
    power: 4, 
    rarity: 'rare',
    description: 'Пульсирует магией',
    price: 50,
  },
  { 
    id: 5, 
    name: 'Зелье силы', 
    icon: '🧪', 
    type: 'potion', 
    power: 2, 
    rarity: 'uncommon',
    description: 'Временно увеличивает силу',
    price: 25,
  },
  { 
    id: 6, 
    name: 'Кольцо защиты', 
    icon: '💍', 
    type: 'accessory', 
    power: 3, 
    rarity: 'rare',
    description: 'Магическая защита',
    price: 40,
  }
];

const ACTIVE_ITEMS = [
  {
    id: 101,
    name: 'Посох молнии',
    icon: '⚡',
    type: 'weapon',
    power: 3,
    rarity: 'epic',
    description: 'Наносит молниевый удар',
    price: 100,
    activeAbility: {
      name: 'Молния',
      description: 'Наносит 8 урона',
      cooldown: 3,
      damage: 8,
    }
  },
  {
    id: 102,
    name: 'Святая граната',
    icon: '💥',
    type: 'accessory',
    power: 1,
    rarity: 'legendary',
    description: 'Мощный взрыв',
    price: 150,
    activeAbility: {
      name: 'Взрыв',
      description: 'Наносит 12 урона',
      cooldown: 5,
      damage: 12,
    }
  },
  {
    id: 103,
    name: 'Лечебный амулет',
    icon: '✨',
    type: 'accessory',
    power: 2,
    rarity: 'rare',
    description: 'Восстанавливает здоровье',
    price: 80,
    activeAbility: {
      name: 'Исцеление',
      description: 'Восстанавливает 20 здоровья',
      cooldown: 4,
      heal: 20,
    }
  }
];

const RANDOM_EVENTS = [
  {
    id: 1,
    name: 'Ловушка!',
    icon: '🕳️',
    description: 'Вы попали в ловушку и потеряли немного здоровья',
    effect: (hero) => ({ ...hero, health: Math.max(1, hero.health - 15) }),
    type: 'negative'
  },
  {
    id: 2,
    name: 'Счастливая находка',
    icon: '💰',
    description: 'Вы нашли кошелек с золотом!',
    effect: (hero) => ({ ...hero, gold: hero.gold + 30 }),
    type: 'positive'
  },
  {
    id: 3,
    name: 'Благословение',
    icon: '🙏',
    description: 'Божественная сила восстанавливает ваше здоровье',
    effect: (hero) => ({ ...hero, health: Math.min(hero.maxHealth, hero.health + 25) }),
    type: 'positive'
  },
  {
    id: 4,
    name: 'Проклятие',
    icon: '😈',
    description: 'Тёмная магия ослабляет вас на время',
    effect: (hero) => ({ ...hero, cursed: true, curseCounter: 3 }),
    type: 'negative'
  },
  {
    id: 5,
    name: 'Торговец',
    icon: '🧙‍♂️',
    description: 'Торговец предлагает вам выгодную сделку',
    effect: (hero) => ({ ...hero, merchantVisit: true }),
    type: 'neutral'
  }
];

const MINI_QUESTS = [
  {
    id: 1,
    name: 'Убийца гоблинов',
    description: 'Победите 3 гоблинов',
    icon: '👹',
    target: 3,
    condition: (stats, monster) => monster.name === 'Гоблин',
    reward: { gold: 50, experience: 25 }
  },
  {
    id: 2,
    name: 'Коллекционер',
    description: 'Соберите 5 сокровищ',
    icon: '💎',
    target: 5,
    condition: (stats) => stats.treasuresCollected,
    reward: { gold: 30, health: 20 }
  },
  {
    id: 3,
    name: 'Серийный победитель',
    description: 'Выиграйте 3 боя подряд',
    icon: '🏆',
    target: 3,
    condition: 'winStreak',
    reward: { gold: 75, level: 1 }
  },
  {
    id: 4,
    name: 'Золотоискатель',
    description: 'Накопите 200 золота',
    icon: '💰',
    target: 200,
    condition: (stats, monster, hero) => hero.gold >= 200,
    reward: { experience: 50 }
  }
];

const EASTER_EGGS = [
  {
    id: 1,
    message: '🎭 "Это не баг, это фича!" - Программист',
    type: 'meme'
  },
  {
    id: 2,
    message: '🐛 Вы нашли редкого цифрового жука! (+1 к удаче)',
    type: 'bonus',
    effect: (hero) => ({ ...hero, luck: (hero.luck || 0) + 1 })
  },
  {
    id: 3,
    message: '🎪 "Жизнь как цирк, а мы все клоуны" - Мудрый гоблин',
    type: 'wisdom'
  },
  {
    id: 4,
    message: '🎮 Пасхалка #4: Помните, что самый главный враг - это прокрастинация!',
    type: 'meta'
  },
  {
    id: 5,
    message: '🤖 "Да, я ИИ, но у меня есть чувство юмора!" - Ваш код',
    type: 'ai'
  }
];

const LEVEL_UP_UPGRADES = [
  {
    id: 1,
    name: 'Крепкое здоровье',
    icon: '❤️',
    description: '+15 к максимальному здоровью',
    effect: (hero) => ({ 
      ...hero, 
      maxHealth: hero.maxHealth + 15,
      health: hero.health + 15
    })
  },
  {
    id: 2,
    name: 'Удача в бою',
    icon: '🍀',
    description: '+10% шанс критического удара',
    effect: (hero) => ({ 
      ...hero, 
      criticalChance: (hero.criticalChance || 0) + 0.1
    })
  },
  {
    id: 3,
    name: 'Ловкость',
    icon: '💨',
    description: '+10% шанс уклонения',
    effect: (hero) => ({ 
      ...hero, 
      dodgeChance: (hero.dodgeChance || 0) + 0.1
    })
  },
  {
    id: 4,
    name: 'Торговец',
    icon: '💰',
    description: '+50% больше золота с побед',
    effect: (hero) => ({ 
      ...hero, 
      goldMultiplier: (hero.goldMultiplier || 1) + 0.5
    })
  },
  {
    id: 5,
    name: 'Регенерация',
    icon: '🔄',
    description: 'Восстанавливает 5 здоровья после каждого боя',
    effect: (hero) => ({ 
      ...hero, 
      regeneration: (hero.regeneration || 0) + 5
    })
  },
  {
    id: 6,
    name: 'Магический щит',
    icon: '🛡️',
    description: '+2 к защите',
    effect: (hero) => ({ 
      ...hero, 
      magicShield: (hero.magicShield || 0) + 2
    })
  }
];

const ACHIEVEMENTS = [
  {
    id: 'first_victory',
    name: 'Первая победа',
    description: 'Победите своего первого монстра',
    icon: '🎉',
    condition: (stats) => stats.victories >= 1
  },
  {
    id: 'treasure_hunter',
    name: 'Охотник за сокровищами',
    description: 'Соберите 10 сокровищ',
    icon: '💎',
    condition: (stats) => stats.treasuresCollected >= 10
  },
  {
    id: 'level_master',
    name: 'Мастер уровней',
    description: 'Достигните 5 уровня',
    icon: '⭐',
    condition: (stats) => stats.maxLevel >= 5
  },
  {
    id: 'gold_hoarder',
    name: 'Скупердяй',
    description: 'Накопите 500 золота',
    icon: '💰',
    condition: (stats, hero) => hero.gold >= 500
  },
  {
    id: 'unstoppable',
    name: 'Неудержимый',
    description: 'Выиграйте 5 боев подряд',
    icon: '🔥',
    condition: (stats) => stats.maxWinStreak >= 5
  }
];

// ==================== UTILITY FUNCTIONS ====================
const safeGet = (obj, path, defaultValue = null) => {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  } catch (error) {
    return defaultValue;
  }
};

const isValidValue = (value) => value !== null && value !== undefined;

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ==================== CUSTOM HOOKS ====================
const useLocalStorage = (key, initialValue, onError = null) => {
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

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    const notification = {
      id: generateId(),
      message,
      type,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [...prev, notification].slice(-GAME_CONSTANTS.NOTIFICATIONS_LIMIT));
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, GAME_CONSTANTS.NOTIFICATION_DURATION);
  }, []);

  return { notifications, addNotification };
};

const useAnimations = () => {
  const [animations, setAnimations] = useState({});

  const triggerAnimation = useCallback((key, animationClass = 'animate-pulse') => {
    setAnimations(prev => ({ ...prev, [key]: animationClass }));
    setTimeout(() => {
      setAnimations(prev => ({ ...prev, [key]: null }));
    }, 1000);
  }, []);

  return { animations, triggerAnimation };
};

// ==================== REUSABLE COMPONENTS ====================
const LoadingScreen = () => (
  <div className="w-full h-full min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500 to-blue-600">
    <div className="text-center">
      <div className="text-6xl mb-4 animate-bounce">🃏</div>
      <div className="text-white text-xl animate-pulse">Загрузка Манчкина...</div>
    </div>
  </div>
);

const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Game Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return fallback || (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-center p-6">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Что-то пошло не так</h2>
          <p className="text-red-600 mb-4">Произошла ошибка в игре</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Перезагрузить игру
          </button>
        </div>
      </div>
    );
  }

  return children;
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center';
  const variants = {
    primary: `bg-gradient-to-r ${UI_CONSTANTS.COLORS.primary} text-white hover:scale-105 active:scale-95`,
    success: `bg-gradient-to-r ${UI_CONSTANTS.COLORS.success} text-white hover:scale-105 active:scale-95`,
    danger: `bg-gradient-to-r ${UI_CONSTANTS.COLORS.danger} text-white hover:scale-105 active:scale-95`,
    warning: `bg-gradient-to-r ${UI_CONSTANTS.COLORS.warning} text-white hover:scale-105 active:scale-95`,
    legendary: `bg-gradient-to-r ${UI_CONSTANTS.COLORS.legendary} text-white hover:scale-105 active:scale-95`,
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };
  const sizes = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ 
  card, 
  onClick, 
  className = '', 
  showStats = true,
  disabled = false,
  animation = null
}) => {
  if (!card || !isValidValue(card.name)) {
    return (
      <div className={`p-3 rounded-xl border-2 border-gray-300 bg-gray-100 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">❓</div>
          <div className="text-sm">Неверная карта</div>
        </div>
      </div>
    );
  }

  const rarityColors = {
    common: 'border-gray-300',
    uncommon: 'border-green-400',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-yellow-400',
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        relative p-3 rounded-xl border-2 transition-all duration-300 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'} 
        ${rarityColors[card.rarity] || 'border-gray-300'}
        ${animation || ''}
        ${className}
      `}
      style={UI_CONSTANTS.CARD_STYLE}
    >
      <div className="text-center">
        <div className="text-2xl mb-2">{card.icon || '❓'}</div>
        <div className="font-bold text-sm mb-1">{card.name}</div>
        <div className="text-xs text-gray-600 mb-1">{card.description || ''}</div>
        {showStats && card.power && (
          <div className="text-xs text-blue-600 font-semibold">Сила: +{card.power}</div>
        )}
        {card.activeAbility && (
          <div className="text-xs text-purple-600 font-semibold mt-1">
            Активная способность: {card.activeAbility.name}
          </div>
        )}
        {card.rarity && (
          <div className={`text-xs mt-1 font-medium ${
            card.rarity === 'legendary' ? 'text-yellow-600' :
            card.rarity === 'epic' ? 'text-purple-600' :
            card.rarity === 'rare' ? 'text-blue-600' :
            card.rarity === 'uncommon' ? 'text-green-600' :
            'text-gray-600'
          }`}>
            {card.rarity}
          </div>
        )}
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, showClose = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full max-h-[90vh] overflow-auto" style={UI_CONSTANTS.CARD_STYLE}>
        <div className="p-6">
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              {showClose && (
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

const Notifications = ({ notifications }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-2 z-50 space-y-1 max-w-xs">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 rounded-xl text-white text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-500 transform ${
            notification.type === 'success' ? 'bg-green-500 animate-bounce' :
            notification.type === 'error' ? 'bg-red-500 animate-shake' :
            notification.type === 'warning' ? 'bg-orange-500 animate-pulse' :
            'bg-blue-500 animate-slide-in'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="text-base">
              {notification.type === 'success' ? '✅' : 
               notification.type === 'warning' ? '⚠️' : 
               notification.type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <div>{notification.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DifficultySelector = ({ onSelect }) => (
  <Modal isOpen={true} onClose={null} title="🎯 Выберите уровень сложности" showClose={false}>
    <div className="space-y-3">
      {Object.entries(DIFFICULTY_MODES).map(([key, mode]) => (
        <Button
          key={key}
          onClick={() => onSelect(key)}
          variant={key === 'hardcore' ? 'danger' : key === 'easy' ? 'success' : 'primary'}
          className="w-full text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{mode.icon}</div>
            <div>
              <div className="font-bold">{mode.name}</div>
              <div className="text-sm opacity-80">{mode.description}</div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  </Modal>
);

const LevelUpModal = ({ isOpen, onClose, onSelectUpgrade, upgrades }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="🎉 Повышение уровня!" showClose={false}>
    <div className="space-y-4">
      <p className="text-center text-gray-600">Выберите одно улучшение:</p>
      <div className="space-y-3">
        {upgrades.map((upgrade) => (
          <Button
            key={upgrade.id}
            onClick={() => onSelectUpgrade(upgrade)}
            variant="primary"
            className="w-full text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{upgrade.icon}</div>
              <div>
                <div className="font-bold">{upgrade.name}</div>
                <div className="text-sm opacity-80">{upgrade.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  </Modal>
);

const RandomEventModal = ({ isOpen, onClose, event }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={event ? `${event.icon} ${event.name}` : ''}>
    {event && (
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">{event.icon}</div>
        <p className="text-gray-700">{event.description}</p>
        <Button onClick={onClose} variant="primary">
          Продолжить
        </Button>
      </div>
    )}
  </Modal>
);

const QuestTracker = ({ quests, onQuestComplete }) => {
  const activeQuests = quests.filter(q => q.active && !q.completed);
  
  if (activeQuests.length === 0) return null;

  return (
    <div className="p-4" style={UI_CONSTANTS.CARD_STYLE}>
      <h3 className="text-lg font-bold text-center mb-3">📋 Задания</h3>
      <div className="space-y-2">
        {activeQuests.map((quest) => (
          <div key={quest.id} className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-lg">{quest.icon}</div>
                <div>
                  <div className="font-bold text-sm">{quest.name}</div>
                  <div className="text-xs text-gray-600">{quest.description}</div>
                </div>
              </div>
              <div className="text-sm font-bold text-blue-600">
                {quest.progress || 0}/{quest.target}
              </div>
            </div>
            {quest.progress >= quest.target && (
              <Button
                onClick={() => onQuestComplete(quest)}
                variant="success"
                size="small"
                className="w-full mt-2"
              >
                Завершить
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Leaderboard = ({ gameStats, allTimeStats }) => (
  <div className="p-4" style={UI_CONSTANTS.CARD_STYLE}>
    <h3 className="text-lg font-bold text-center mb-3">🏆 Рекорды</h3>
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-2 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{allTimeStats.bestLevel}</div>
          <div className="text-xs text-gray-600">Лучший уровень</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{allTimeStats.maxGold}</div>
          <div className="text-xs text-gray-600">Больше всего золота</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{allTimeStats.totalVictories}</div>
          <div className="text-xs text-gray-600">Общие победы</div>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{allTimeStats.maxWinStreak}</div>
          <div className="text-xs text-gray-600">Лучшая серия</div>
        </div>
      </div>
      <div className="text-center p-2 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Время игры: {Math.floor(allTimeStats.totalPlayTime / 60)}:{(allTimeStats.totalPlayTime % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  </div>
);

const ThemeSelector = ({ currentTheme, onThemeChange, unlockedThemes, gameStats }) => (
  <div className="p-4" style={UI_CONSTANTS.CARD_STYLE}>
    <h3 className="text-lg font-bold text-center mb-3">🎨 Темы</h3>
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(THEMES).map(([key, theme]) => {
        const isUnlocked = theme.unlocked || unlockedThemes.includes(key) || 
          (theme.unlockCondition && theme.unlockCondition(gameStats));
        
        return (
          <button
            key={key}
            onClick={() => isUnlocked && onThemeChange(key)}
            className={`p-3 rounded-xl border-2 transition-all duration-300 ${
              currentTheme === key 
                ? 'border-blue-400 bg-blue-50' 
                : isUnlocked 
                  ? 'border-gray-300 hover:border-gray-400' 
                  : 'border-gray-200 opacity-50 cursor-not-allowed'
            }`}
            disabled={!isUnlocked}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">{theme.icon}</div>
              <div className="font-bold text-sm">{theme.name}</div>
              {!isUnlocked && theme.unlockCondition && (
                <div className="text-xs text-gray-500 mt-1">🔒 Заблокировано</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

const BattleModal = ({ isOpen, battle, onAttack, onRunAway, onUseAbility, onClose, animations }) => {
  if (!isOpen || !battle) return null;

  const { monster, heroPower, activeItems } = battle;
  const canWin = heroPower >= monster.power;

  return (
    <Modal isOpen={isOpen} onClose={null} title="⚔️ Сражение!" showClose={false}>
      <div className="text-center space-y-4">
        <div className={`text-6xl ${animations.monster || 'animate-bounce'}`}>
          {monster.icon}
        </div>
        <h3 className="text-xl font-bold">{monster.name}</h3>
        <p className="text-gray-600">{monster.description}</p>
        
        <div className="flex justify-between items-center p-3 bg-gray-100 rounded-xl">
          <div className="text-center">
            <div className="text-sm text-gray-500">Ваша сила</div>
            <div className={`text-2xl font-bold text-blue-600 ${animations.heroPower || ''}`}>
              {heroPower}
            </div>
          </div>
          <div className="text-2xl animate-pulse">⚔️</div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Сила монстра</div>
            <div className={`text-2xl font-bold text-red-600 ${animations.monsterPower || ''}`}>
              {monster.power}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={onAttack}
            variant={canWin ? 'success' : 'danger'}
            className="w-full"
          >
            {canWin ? '🎉 Сражаться (Победа!)' : '💀 Сражаться (Поражение!)'}
          </Button>
          
          {activeItems && activeItems.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-bold">Активные способности:</div>
              {activeItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => onUseAbility(item)}
                  variant="legendary"
                  size="small"
                  className="w-full"
                  disabled={item.cooldownRemaining > 0}
                >
                  {item.activeAbility.name} ({item.cooldownRemaining > 0 ? `${item.cooldownRemaining} ходов` : 'Готово'})
                </Button>
              ))}
            </div>
          )}
          
          <Button
            onClick={onRunAway}
            variant="secondary"
            className="w-full"
          >
            🏃 Убежать
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const TutorialModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="🎓 Как играть в Манчкин">
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-bold mb-2">🎯 Цель игры:</h3>
        <p>Достигните высокого уровня, сражаясь с монстрами и собирая сокровища!</p>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">🚪 Двери приключений:</h3>
        <p>Нажмите на колоду дверей, чтобы встретить монстра или найти сокровище.</p>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">⚔️ Сражения:</h3>
        <p>Ваша сила = Уровень + Экипировка. Если она больше силы монстра - вы побеждаете!</p>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">💎 Сокровища:</h3>
        <p>После победы над монстром можете взять карту сокровищ. Экипируйте предметы, нажав на них в руке.</p>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">🎯 Задания:</h3>
        <p>Выполняйте мини-задания для получения дополнительных наград!</p>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">⚡ Активные способности:</h3>
        <p>Некоторые предметы имеют активные способности, которые можно использовать в бою.</p>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">🏃 Побег:</h3>
        <p>Если монстр слишком силен, можете попытаться убежать, но это не всегда получается!</p>
      </div>
    </div>
  </Modal>
);

const VictoryModal = ({ isOpen, onClose, monster, rewards, isCritical }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={isCritical ? "💥 КРИТИЧЕСКАЯ ПОБЕДА!" : "🎉 Победа!"}>
    <div className="text-center space-y-4">
      <div className={`text-6xl ${isCritical ? 'animate-spin' : 'animate-bounce'}`}>
        {isCritical ? '⚡' : monster?.icon}
      </div>
      <h3 className="text-xl font-bold">
        {isCritical ? 'Критический удар!' : `Вы победили ${monster?.name}!`}
      </h3>
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Награды:</h4>
        <div className="space-y-1">
          {rewards?.level && <div className="animate-pulse">🎯 +{rewards.level} уровень</div>}
          {rewards?.gold && <div className="animate-pulse">💰 +{rewards.gold} золота</div>}
          {rewards?.experience && <div className="animate-pulse">✨ +{rewards.experience} опыта</div>}
          {rewards?.health && <div className="animate-pulse">❤️ +{rewards.health} здоровья</div>}
        </div>
      </div>
      <Button onClick={onClose} variant="success" className="animate-pulse">
        Продолжить приключение
      </Button>
    </div>
  </Modal>
);

const DefeatModal = ({ isOpen, onClose, monster, isDodged }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={isDodged ? "💨 Уклонение!" : "💀 Поражение"}>
    <div className="text-center space-y-4">
      <div className={`text-6xl ${isDodged ? 'animate-ping' : 'animate-bounce'}`}>
        {isDodged ? '💨' : monster?.icon}
      </div>
      <h3 className="text-xl font-bold">
        {isDodged ? 'Вы уклонились от атаки!' : `${monster?.name} оказался сильнее`}
      </h3>
      <div className={`p-4 rounded-lg ${isDodged ? 'bg-blue-50' : 'bg-red-50'}`}>
        <p className={isDodged ? 'text-blue-700' : 'text-red-700'}>
          {isDodged ? 'Быстрая реакция спасла вас!' : 'Вы потеряли часть здоровья, но не сдавайтесь!'}
        </p>
      </div>
      <Button onClick={onClose} variant={isDodged ? 'primary' : 'danger'}>
        {isDodged ? 'Продолжить' : 'Попробовать снова'}
      </Button>
    </div>
  </Modal>
);

const PlayerHand = ({ hand, onCardClick, handLimit, animations }) => {
  if (!hand || hand.length === 0) return null;

  return (
    <div className="p-4" style={UI_CONSTANTS.CARD_STYLE}>
      <h3 className="text-lg font-bold text-center mb-3">
        🃏 Рука ({hand.length}/{handLimit})
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {hand.map((card, index) => (
          <Card
            key={card.id || index}
            card={card}
            onClick={() => onCardClick(card)}
            className="border-blue-200 hover:border-blue-400"
            animation={animations[`card-${index}`]}
          />
        ))}
      </div>
    </div>
  );
};

const HeroProfile = ({ hero, calculateHeroPower, theme, animations }) => {
  const healthPercent = (hero.health / hero.maxHealth) * 100;
  const currentTheme = THEMES[theme] || THEMES.classic;
  
  return (
    <div className="p-3 flex-shrink-0">
      <div className="p-4" style={UI_CONSTANTS.CARD_STYLE}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${currentTheme.cardGradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg ${animations.hero || ''}`}>
              {currentTheme.heroIcon}
            </div>
            <div>
              <h2 className="text-lg font-bold">{hero.name}</h2>
              <div className="flex items-center space-x-2">
                <div className={`bg-gradient-to-r ${currentTheme.cardGradient} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                  Уровень {hero.level}
                </div>
                <div className="text-xs text-gray-600">Сила: {calculateHeroPower()}</div>
              </div>
              {hero.cursed && (
                <div className="text-xs text-red-600 animate-pulse">
                  😈 Проклят ({hero.curseCounter} ходов)
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500">💰</span>
              <span className={`font-bold text-sm ${animations.gold || ''}`}>{hero.gold}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-500">❤️</span>
              <span className={`font-bold text-sm ${animations.health || ''}`}>{hero.health}/{hero.maxHealth}</span>
            </div>
            {hero.winStreak > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">🔥</span>
                <span className="font-bold text-sm">{hero.winStreak}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center space-x-3">
            <div className="text-red-500">❤️</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-400 to-pink-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
            <div className="text-xs text-gray-600">
              {hero.health}/{hero.maxHealth}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryTab = ({ hero, onEquipItem, onResetProgress, onThemeChange, currentTheme, unlockedThemes, gameStats, allTimeStats }) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-center">🎒 Инвентарь</h2>
      
      {/* Equipment Slots */}
      <div className="p-4" style={UI_CONSTANTS.CARD_STYLE}>
        <h3 className="text-lg font-bold mb-3">⚔️ Экипировка</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(hero.equipped || {}).map(([slot, item]) => (
            <div key={slot} className="p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {slot === 'weapon' ? '🗡️ Оружие' :
                   slot === 'armor' ? '🛡️ Броня' :
                   slot === 'boots' ? '👟 Обувь' : 
                   slot === 'accessory' ? '💍 Аксессуар' : slot}
                </div>
                {item ? (
                  <div>
                    <div className="text-lg mb-1">{item.icon}</div>
                    <div className="text-sm font-bold">{item.name}</div>
                    <div className="text-xs text-blue-600">+{item.power}</div>
                    {item.activeAbility && (
                      <div className="text-xs text-purple-600">⚡ Активная</div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">Пусто</div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Character Stats */}
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <h4 className="font-bold mb-2">📊 Характеристики</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {hero.criticalChance && (
              <div>🎯 Крит: {Math.round(hero.criticalChance * 100)}%</div>
            )}
            {hero.dodgeChance && (
              <div>💨 Уклонение: {Math.round(hero.dodgeChance * 100)}%</div>
            )}
            {hero.goldMultiplier && hero.goldMultiplier > 1 && (
              <div>💰 Золото: +{Math.round((hero.goldMultiplier - 1) * 100)}%</div>
            )}
            {hero.regeneration && (
              <div>🔄 Регенерация: +{hero.regeneration}</div>
            )}
            {hero.magicShield && (
              <div>🛡️ Маг. щит: +{hero.magicShield}</div>
            )}
            {hero.luck && (
              <div>🍀 Удача: +{hero.luck}</div>
            )}
          </div>
        </div>
      </div>

      {/* Themes */}
      <ThemeSelector 
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        unlockedThemes={unlockedThemes}
        gameStats={gameStats}
      />

      {/* Leaderboard */}
      <Leaderboard gameStats={gameStats} allTimeStats={allTimeStats} />

      {/* Settings */}
      <div className="p-4" style={UI_CONSTANTS.CARD_STYLE}>
        <h3 className="text-lg font-bold mb-3">⚙️ Настройки</h3>
        <Button 
          onClick={onResetProgress} 
          variant="danger" 
          className="w-full"
        >
          🔄 Сбросить прогресс
        </Button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Это действие нельзя отменить
        </p>
      </div>
    </div>
  );
};

const AchievementsTab = ({ gameStats, unlockedAchievements, hero }) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-center">🏆 Достижения</h2>
      
      {/* Statistics */}
      <div className="p-4" style={UI_CONSTANTS.CARD_STYLE}>
        <h3 className="text-lg font-bold mb-3">📊 Статистика</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{gameStats.victories}</div>
            <div className="text-xs text-gray-600">Победы</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">{gameStats.defeats}</div>
            <div className="text-xs text-gray-600">Поражения</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{gameStats.treasuresCollected}</div>
            <div className="text-xs text-gray-600">Сокровища</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">{gameStats.maxLevel}</div>
            <div className="text-xs text-gray-600">Макс. уровень</div>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <div className="text-xl font-bold text-yellow-600">{gameStats.maxWinStreak || 0}</div>
            <div className="text-xs text-gray-600">Лучшая серия</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{gameStats.criticalHits || 0}</div>
            <div className="text-xs text-gray-600">Критические удары</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        {ACHIEVEMENTS.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          return (
            <div 
              key={achievement.id}
              className={`p-4 rounded-xl transition-all duration-300 ${isUnlocked ? 'bg-green-50 border-green-200 animate-pulse' : 'bg-gray-50 border-gray-200'} border`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${isUnlocked ? 'animate-bounce' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-bold ${isUnlocked ? 'text-green-800' : 'text-gray-600'}`}>
                    {achievement.name}
                  </div>
                  <div className={`text-sm ${isUnlocked ? 'text-green-600' : 'text-gray-500'}`}>
                    {achievement.description}
                  </div>
                </div>
                {isUnlocked && <div className="text-green-500 text-xl animate-spin">✅</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==================== MAIN GAME COMPONENT ====================
const MunchkinCardGame = () => {
  const { useStoredState } = hatch;
  
  // Error handling for localStorage
  const handleStorageError = useCallback((error) => {
    console.warn('localStorage error:', error);
  }, []);

  const [difficulty, setDifficulty] = useStoredState('munchkinDifficulty', null, handleStorageError);
  const [currentTheme, setCurrentTheme] = useStoredState('munchkinTheme', 'classic', handleStorageError);
  const [unlockedThemes, setUnlockedThemes] = useStoredState('munchkinUnlockedThemes', [], handleStorageError);

  const [hero, setHero] = useStoredState('munchkinHero', {
    name: 'Новичок',
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
    curseCounter: 0,
  }, handleStorageError);

  const [gameStats, setGameStats] = useLocalStorage('munchkinStats', {
    victories: 0,
    defeats: 0,
    treasuresCollected: 0,
    maxLevel: 1,
    gamesPlayed: 0,
    maxWinStreak: 0,
    criticalHits: 0,
    totalGoldEarned: 0,
    monstersKilled: 0,
    questsCompleted: 0,
  }, handleStorageError);

  const [allTimeStats, setAllTimeStats] = useLocalStorage('munchkinAllTimeStats', {
    bestLevel: 1,
    maxGold: 50,
    totalVictories: 0,
    maxWinStreak: 0,
    totalPlayTime: 0,
    gamesPlayed: 0,
  }, handleStorageError);

  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage('munchkinAchievements', [], handleStorageError);

  const [quests, setQuests] = useLocalStorage('munchkinQuests', [], handleStorageError);

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
    sessionStartTime: Date.now(),
  });

  const [currentTab, setCurrentTab] = useState('main');
  const [isLoading, setIsLoading] = useState(true);

  const { notifications, addNotification } = useNotifications();
  const { animations, triggerAnimation } = useAnimations();

  const currentThemeData = THEMES[currentTheme] || THEMES.classic;
  const difficultyData = DIFFICULTY_MODES[difficulty] || DIFFICULTY_MODES.normal;

  // Initialize game
  useEffect(() => {
    if (!hero.equipped) {
      setHero(prev => ({
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
        curseCounter: prev.curseCounter || 0,
      }));
    }
    setIsLoading(false);
  }, [hero.equipped, setHero]);

  // Initialize quests
  useEffect(() => {
    if (quests.length === 0) {
      const initialQuests = shuffleArray(MINI_QUESTS).slice(0, 2).map(quest => ({
        ...quest,
        active: true,
        completed: false,
        progress: 0,
      }));
      setQuests(initialQuests);
    }
  }, [quests.length, setQuests]);

  // Update play time
  useEffect(() => {
    const interval = setInterval(() => {
      const playTime = Math.floor((Date.now() - gameState.sessionStartTime) / 1000);
      setAllTimeStats(prev => ({
        ...prev,
        totalPlayTime: prev.totalPlayTime + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.sessionStartTime, setAllTimeStats]);

  // Check for new achievements
  useEffect(() => {
    ACHIEVEMENTS.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id) && achievement.condition(gameStats, hero)) {
        setUnlockedAchievements(prev => [...prev, achievement.id]);
        addNotification(`🏆 Достижение: ${achievement.name}`, 'success');
        triggerAnimation('achievement', 'animate-bounce');
      }
    });
  }, [gameStats, hero, unlockedAchievements, setUnlockedAchievements, addNotification, triggerAnimation]);

  // Check for theme unlocks
  useEffect(() => {
    Object.entries(THEMES).forEach(([key, theme]) => {
      if (!unlockedThemes.includes(key) && theme.unlockCondition && theme.unlockCondition(gameStats)) {
        setUnlockedThemes(prev => [...prev, key]);
        addNotification(`🎨 Разблокирована тема: ${theme.name}`, 'success');
      }
    });
  }, [gameStats, unlockedThemes, setUnlockedThemes, addNotification]);

  // Update curse counter
  useEffect(() => {
    if (hero.cursed && hero.curseCounter > 0) {
      const timer = setTimeout(() => {
        setHero(prev => ({
          ...prev,
          curseCounter: prev.curseCounter - 1,
          cursed: prev.curseCounter <= 1 ? false : true
        }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hero.cursed, hero.curseCounter, setHero]);

  const calculateHeroPower = useCallback(() => {
    let totalPower = hero.level;
    
    if (hero.equipped) {
      Object.values(hero.equipped).forEach(item => {
        if (item && item.power) {
          totalPower += item.power;
        }
      });
    }
    
    // Apply curse penalty
    if (hero.cursed) {
      totalPower = Math.max(1, totalPower - 2);
    }
    
    // Apply magic shield bonus
    if (hero.magicShield) {
      totalPower += hero.magicShield;
    }
    
    return Math.max(1, totalPower);
  }, [hero.level, hero.equipped, hero.cursed, hero.magicShield]);

  const drawDoorCard = useCallback(() => {
    // Check for random events
    if (Math.random() < GAME_CONSTANTS.RANDOM_EVENT_CHANCE) {
      const randomEvent = getRandomElement(RANDOM_EVENTS);
      setGameState(prev => ({
        ...prev,
        showRandomEventModal: true,
        lastEvent: randomEvent
      }));
      
      const newHero = randomEvent.effect(hero);
      setHero(newHero);
      addNotification(`🎲 ${randomEvent.name}`, randomEvent.type === 'positive' ? 'success' : 'warning');
      return;
    }

    // Check for easter eggs
    if (Math.random() < GAME_CONSTANTS.EASTER_EGG_CHANCE) {
      const easterEgg = getRandomElement(EASTER_EGGS);
      addNotification(easterEgg.message, 'info');
      
      if (easterEgg.effect) {
        const newHero = easterEgg.effect(hero);
        setHero(newHero);
      }
    }

    // Generate all available monsters (base + active items)
    const allMonsters = [...MONSTERS, ...ACTIVE_ITEMS.filter(item => item.type === 'monster')];
    const randomMonster = getRandomElement(allMonsters);
    
    // Apply difficulty scaling
    const scaledMonster = {
      ...randomMonster,
      power: Math.ceil(randomMonster.power * difficultyData.enemyPowerMultiplier),
      health: Math.ceil(randomMonster.health * difficultyData.enemyPowerMultiplier),
    };
    
    addNotification(`🚪 Встретил ${scaledMonster.name}!`, 'info');
    
    const heroPower = calculateHeroPower();
    const activeItems = Object.values(hero.equipped).filter(item => item && item.activeAbility);
    
    setGameState(prev => ({
      ...prev,
      battleMode: true,
      currentEvent: { 
        type: 'monster', 
        data: { 
          ...scaledMonster, 
          currentHealth: scaledMonster.health 
        } 
      },
      lastBattle: {
        monster: scaledMonster,
        heroPower,
        activeItems: activeItems.map(item => ({
          ...item,
          cooldownRemaining: item.cooldownRemaining || 0
        }))
      }
    }));
    
    triggerAnimation('monster', 'animate-shake');
  }, [hero, calculateHeroPower, addNotification, setHero, difficultyData, triggerAnimation]);

  const drawTreasureCard = useCallback(() => {
    if (!gameState.canDrawTreasure) {
      addNotification('Нужно победить монстра!', 'warning');
      return;
    }
    
    // Mix regular treasures with active items
    const allTreasures = [...TREASURES, ...ACTIVE_ITEMS];
    const randomTreasure = getRandomElement(allTreasures);
    
    addNotification(`💎 Получил ${randomTreasure.name}!`, 'success');
    
    if (hero.hand.length < GAME_CONSTANTS.HAND_LIMIT) {
      setHero(prev => ({
        ...prev,
        hand: [...prev.hand, { ...randomTreasure, id: generateId() }]
      }));
    }
    
    setGameState(prev => ({
      ...prev,
      canDrawTreasure: false
    }));

    setGameStats(prev => ({
      ...prev,
      treasuresCollected: prev.treasuresCollected + 1
    }));
    
    triggerAnimation('treasure', 'animate-bounce');
  }, [gameState.canDrawTreasure, hero.hand.length, setHero, setGameStats, addNotification, triggerAnimation]);

  const updateQuests = useCallback((action, data) => {
    setQuests(prev => prev.map(quest => {
      if (!quest.active || quest.completed) return quest;
      
      let shouldUpdate = false;
      
      if (action === 'victory' && quest.condition === 'winStreak') {
        shouldUpdate = true;
      } else if (action === 'victory' && typeof quest.condition === 'function') {
        shouldUpdate = quest.condition(gameStats, data);
      } else if (action === 'treasure' && quest.condition === 'treasures') {
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
      // Check for dodge
      const dodgeChance = hero.dodgeChance || 0;
      const isDodged = Math.random() < dodgeChance;
      
      if (isDodged) {
        addNotification('💨 Вы уклонились от атаки!', 'success');
        setGameState(prev => ({
          ...prev,
          battleMode: false,
          currentEvent: null,
          showDefeatModal: true,
          isDodged: true
        }));
        return;
      }
      
      if (heroPower >= monster.power) {
        // Check for critical hit
        const criticalChance = hero.criticalChance || 0;
        const isCritical = Math.random() < criticalChance;
        
        if (isCritical) {
          setGameStats(prev => ({
            ...prev,
            criticalHits: prev.criticalHits + 1
          }));
          addNotification('💥 Критический удар!', 'success');
          triggerAnimation('critical', 'animate-pulse');
        }
        
        // Victory
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
        
        setHero(prev => ({
          ...prev,
          level: levelUp ? prev.level + 1 : prev.level,
          gold: prev.gold + goldReward,
          maxHealth: levelUp ? prev.maxHealth + 10 : prev.maxHealth,
          health: levelUp ? prev.health + 10 : prev.health,
          winStreak: newWinStreak,
          experience: (prev.experience || 0) + experienceReward,
          health: Math.min(prev.maxHealth, prev.health + (prev.regeneration || 0))
        }));

        setGameStats(prev => ({
          ...prev,
          victories: prev.victories + 1,
          maxLevel: Math.max(prev.maxLevel, hero.level + (levelUp ? 1 : 0)),
          maxWinStreak: Math.max(prev.maxWinStreak, newWinStreak),
          totalGoldEarned: prev.totalGoldEarned + goldReward,
          monstersKilled: prev.monstersKilled + 1,
        }));

        setAllTimeStats(prev => ({
          ...prev,
          totalVictories: prev.totalVictories + 1,
          maxGold: Math.max(prev.maxGold, hero.gold + goldReward),
          bestLevel: Math.max(prev.bestLevel, hero.level + (levelUp ? 1 : 0)),
          maxWinStreak: Math.max(prev.maxWinStreak, newWinStreak),
        }));
        
        updateQuests('victory', monster);
        
        setGameState(prev => ({
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
        
        triggerAnimation('victory', 'animate-bounce');
        triggerAnimation('gold', 'animate-pulse');
      } else {
        // Defeat
        const healthLoss = Math.min(20, hero.health - 1);
        setHero(prev => ({
          ...prev,
          health: Math.max(1, prev.health - healthLoss),
          winStreak: 0
        }));

        setGameStats(prev => ({
          ...prev,
          defeats: prev.defeats + 1
        }));
        
        setGameState(prev => ({
          ...prev,
          battleMode: false,
          currentEvent: null,
          showDefeatModal: true,
          isDodged: false
        }));
        
        triggerAnimation('defeat', 'animate-shake');
        triggerAnimation('health', 'animate-pulse');
      }
    } else {
      // Run away
      const escapeSuccess = Math.random() < 0.7; // 70% chance to escape
      if (escapeSuccess) {
        addNotification('🏃 Удалось убежать!', 'success');
      } else {
        addNotification('💔 Не удалось убежать! Получен урон', 'error');
        const healthLoss = Math.min(10, hero.health - 1);
        setHero(prev => ({
          ...prev,
          health: Math.max(1, prev.health - healthLoss),
          winStreak: 0
        }));
      }
      
      setGameState(prev => ({
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
      setGameState(prev => ({
        ...prev,
        currentEvent: {
          ...prev.currentEvent,
          data: { ...monster, currentHealth: newHealth }
        }
      }));
      
      addNotification(`⚡ ${ability.name} нанесла ${ability.damage} урона!`, 'success');
      
      if (newHealth <= 0) {
        // Monster defeated by ability
        handleBattle(true);
        return;
      }
    }
    
    if (ability.heal) {
      setHero(prev => ({
        ...prev,
        health: Math.min(prev.maxHealth, prev.health + ability.heal)
      }));
      addNotification(`✨ ${ability.name} восстановила ${ability.heal} здоровья!`, 'success');
    }
    
    // Set cooldown
    setHero(prev => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [item.type]: {
          ...item,
          cooldownRemaining: ability.cooldown
        }
      }
    }));
    
    triggerAnimation('ability', 'animate-pulse');
  }, [gameState.currentEvent, setGameState, setHero, addNotification, handleBattle, triggerAnimation]);

  const equipItem = useCallback((item) => {
    if (!item || !item.type) return;
    
    setHero(prev => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [item.type]: item
      },
      hand: prev.hand.filter(handItem => handItem.id !== item.id)
    }));
    
    addNotification(`⚔️ Экипировал ${item.name}!`, 'success');
    triggerAnimation('equip', 'animate-bounce');
  }, [setHero, addNotification, triggerAnimation]);

  const handleLevelUpgrade = useCallback((upgrade) => {
    const newHero = upgrade.effect(hero);
    setHero(newHero);
    addNotification(`🎉 Получено улучшение: ${upgrade.name}!`, 'success');
    
    setGameState(prev => ({
      ...prev,
      showLevelUpModal: false,
      pendingUpgrades: []
    }));
  }, [hero, setHero, addNotification]);

  const completeQuest = useCallback((quest) => {
    setQuests(prev => prev.map(q => 
      q.id === quest.id ? { ...q, completed: true } : q
    ));
    
    // Apply rewards
    if (quest.reward.gold) {
      setHero(prev => ({ ...prev, gold: prev.gold + quest.reward.gold }));
    }
    if (quest.reward.health) {
      setHero(prev => ({ ...prev, health: Math.min(prev.maxHealth, prev.health + quest.reward.health) }));
    }
    if (quest.reward.level) {
      setHero(prev => ({ ...prev, level: prev.level + quest.reward.level }));
    }
    if (quest.reward.experience) {
      setHero(prev => ({ ...prev, experience: (prev.experience || 0) + quest.reward.experience }));
    }
    
    setGameStats(prev => ({
      ...prev,
      questsCompleted: prev.questsCompleted + 1
    }));
    
    addNotification(`✅ Задание завершено: ${quest.name}!`, 'success');
    
    // Add new quest
    const availableQuests = MINI_QUESTS.filter(q => !quests.some(existing => existing.id === q.id));
    if (availableQuests.length > 0) {
      const newQuest = {
        ...getRandomElement(availableQuests),
        active: true,
        completed: false,
        progress: 0,
      };
      setQuests(prev => [...prev, newQuest]);
    }
  }, [setQuests, setHero, setGameStats, addNotification, quests]);

  const resetProgress = useCallback(() => {
    if (window.confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
      const baseHealth = Math.floor(100 * difficultyData.healthMultiplier);
      const baseGold = Math.floor(50 * difficultyData.goldMultiplier);
      
      setHero({
        name: 'Новичок',
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
        curseCounter: 0,
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
        questsCompleted: 0,
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
        sessionStartTime: Date.now(),
      });
      
      addNotification('🔄 Прогресс сброшен', 'info');
    }
  }, [setHero, setGameStats, setUnlockedAchievements, setQuests, addNotification, difficultyData]);

  const renderMainTab = () => (
    <div className="p-4 space-y-6">
      {/* Quests */}
      <QuestTracker quests={quests} onQuestComplete={completeQuest} />
      
      {/* Card Decks */}
      <div className="grid grid-cols-2 gap-8 px-4">
        {/* Door Deck */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-700 mb-6">🚪 Двери</h3>
          <div
            onClick={gameState.battleMode ? undefined : drawDoorCard}
            className={`relative w-40 h-56 mx-auto cursor-pointer transition-all duration-500 ${
              gameState.battleMode ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            } ${animations.doorDeck || ''}`}
            style={{
              background: `linear-gradient(135deg, ${currentThemeData.bgGradient.split(' ')[0]} 0%, ${currentThemeData.bgGradient.split(' ')[2]} 50%, ${currentThemeData.bgGradient.split(' ')[4]} 100%)`,
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(79, 70, 229, 0.15)'
            }}
          >
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-slate-700">
              <div className="text-4xl mb-3 animate-pulse">🎭</div>
              <div className="text-sm font-bold">ПРИКЛЮЧЕНИЯ</div>
            </div>
          </div>
        </div>

        {/* Treasure Deck */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-700 mb-6">💎 Сокровища</h3>
          <div
            onClick={drawTreasureCard}
            className={`relative w-40 h-56 mx-auto cursor-pointer transition-all duration-500 ${
              gameState.canDrawTreasure ? 'hover:scale-105' : 'opacity-60 cursor-not-allowed'
            } ${animations.treasureDeck || ''}`}
            style={{
              background: gameState.canDrawTreasure 
                ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)'
                : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)',
              borderRadius: '16px'
            }}
          >
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-slate-700">
              <div className="text-4xl mb-3">{gameState.canDrawTreasure ? '💎' : '🔒'}</div>
              <div className="text-sm font-bold">СОКРОВИЩА</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Button */}
      <div className="text-center">
        <Button 
          onClick={() => setGameState(prev => ({ ...prev, showTutorial: true }))}
          variant="secondary"
          size="small"
        >
          🎓 Как играть?
        </Button>
      </div>

      {/* Player Hand */}
      {hero.hand && hero.hand.length > 0 && (
        <PlayerHand 
          hand={hero.hand}
          onCardClick={equipItem}
          handLimit={GAME_CONSTANTS.HAND_LIMIT}
          animations={animations}
        />
      )}
    </div>
  );

  // Show difficulty selector if not set
  if (!difficulty) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${currentThemeData.bgGradient}`}>
        <DifficultySelector onSelect={setDifficulty} />
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className={`w-full h-full max-h-screen relative flex flex-col overflow-hidden bg-gradient-to-br ${currentThemeData.bgGradient}`}>
        
        {/* Notifications */}
        <Notifications notifications={notifications} />
        
        {/* Battle Modal */}
        <BattleModal
          isOpen={gameState.battleMode}
          battle={gameState.lastBattle}
          onAttack={() => handleBattle(true)}
          onRunAway={() => handleBattle(false)}
          onUseAbility={useActiveAbility}
          onClose={() => setGameState(prev => ({ ...prev, battleMode: false }))}
          animations={animations}
        />
        
        {/* Level Up Modal */}
        <LevelUpModal
          isOpen={gameState.showLevelUpModal}
          onClose={() => setGameState(prev => ({ ...prev, showLevelUpModal: false }))}
          onSelectUpgrade={handleLevelUpgrade}
          upgrades={gameState.pendingUpgrades}
        />
        
        {/* Random Event Modal */}
        <RandomEventModal
          isOpen={gameState.showRandomEventModal}
          onClose={() => setGameState(prev => ({ ...prev, showRandomEventModal: false }))}
          event={gameState.lastEvent}
        />
        
        {/* Tutorial Modal */}
        <TutorialModal
          isOpen={gameState.showTutorial}
          onClose={() => setGameState(prev => ({ ...prev, showTutorial: false }))}
        />
        
        {/* Victory Modal */}
        <VictoryModal
          isOpen={gameState.showVictoryModal}
          onClose={() => setGameState(prev => ({ ...prev, showVictoryModal: false }))}
          monster={gameState.lastBattle?.monster}
          rewards={gameState.lastRewards}
          isCritical={gameState.isCritical}
        />
        
        {/* Defeat Modal */}
        <DefeatModal
          isOpen={gameState.showDefeatModal}
          onClose={() => setGameState(prev => ({ ...prev, showDefeatModal: false }))}
          monster={gameState.lastBattle?.monster}
          isDodged={gameState.isDodged}
        />
        
        {/* Hero Profile */}
        <HeroProfile 
          hero={hero} 
          calculateHeroPower={calculateHeroPower}
          theme={currentTheme}
          animations={animations}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {currentTab === 'main' && renderMainTab()}
          {currentTab === 'inventory' && (
            <InventoryTab 
              hero={hero} 
              onEquipItem={equipItem}
              onResetProgress={resetProgress}
              onThemeChange={setCurrentTheme}
              currentTheme={currentTheme}
              unlockedThemes={unlockedThemes}
              gameStats={gameStats}
              allTimeStats={allTimeStats}
            />
          )}
          {currentTab === 'achievements' && (
            <AchievementsTab 
              gameStats={gameStats}
              unlockedAchievements={unlockedAchievements}
              hero={hero}
            />
          )}
        </div>
        
        {/* Navigation */}
        <div className="p-2 flex-shrink-0">
          <div className="py-2 px-4" style={UI_CONSTANTS.CARD_STYLE}>
            <div className="flex justify-around items-center">
              {[
                { id: 'main', icon: '🃏', name: 'Игра' },
                { id: 'inventory', icon: '🎒', name: 'Инвентарь' },
                { id: 'achievements', icon: '🏆', name: 'Достижения' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`relative flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                    currentTab === tab.id 
                      ? `bg-gradient-to-r ${currentThemeData.cardGradient} text-white scale-110 shadow-lg` 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-lg">{tab.icon}</div>
                  <div className="text-xs mt-1">{tab.name}</div>
                  {tab.id === 'achievements' && unlockedAchievements.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unlockedAchievements.length}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MunchkinCardGame;