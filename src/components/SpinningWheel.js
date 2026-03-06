// Import React and the useState hook
import React, { useState, useEffect } from 'react';
import { auth, saveWheel, getUserWheels, deleteWheel } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './SpinningWheel.css';

function SpinningWheel({ theme = 'dark' }) {
  // ============================================
  // USER AUTHENTICATION STATE
  // ============================================

  const [user, setUser] = useState(null);

  // ============================================
  // WHEEL STATE
  // ============================================

  const [options, setOptions] = useState([
    { name: 'Pizza 🍕', maxSelections: 3, timesSelected: 0 },
    { name: 'Burger 🍔', maxSelections: 3, timesSelected: 0 },
    { name: 'Sushi 🍣', maxSelections: 3, timesSelected: 0 },
    { name: 'Pasta 🍝', maxSelections: 3, timesSelected: 0 },
    { name: 'Salad 🥗', maxSelections: 3, timesSelected: 0 },
    { name: 'Tacos 🌮', maxSelections: 3, timesSelected: 0 },
    { name: 'Ramen 🍜', maxSelections: 3, timesSelected: 0 },
    { name: 'Steak 🥩', maxSelections: 3, timesSelected: 0 }
  ]);

  const [newOption, setNewOption] = useState('');
  const [maxSelections, setMaxSelections] = useState('');
  const [isLimitEnabled, setIsLimitEnabled] = useState(true);
  const [showOptionsOnWheel] = useState(true);
  const [showOptionsList, setShowOptionsList] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFirework, setShowFirework] = useState(false);
  const [winningSegmentIndex, setWinningSegmentIndex] = useState(null);
  const [wheelName, setWheelName] = useState('My Wheel');
  const [savedWheels, setSavedWheels] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [language] = useState('en');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] = useState(null);

  // ============================================
  // TRANSLATIONS
  // ============================================

  const translations = {
    en: {
      title: 'Spinning Wheel',
      description: 'Add your options and spin to make a random selection',
      spin: 'SPIN',
      spinning: '...',
      unmute: 'Unmute',
      mute: 'Mute',
      result: 'Result',
      manageOptions: 'Manage Options',
      hideList: 'Hide List',
      showList: 'Show List',
      enterNewOption: 'Enter new option...',
      maxUses: 'Max uses',
      addOption: 'Add Option',
      bulkAdd: 'Bulk Add (Paste List)',
      hide: 'Hide',
      setSelectionLimit: 'Set selection limit (uncheck for unlimited)',
      quickLoadPresets: 'Quick Load Presets',
      thaiFood: 'Thai Food',
      partyGames: 'Party Games',
      lottery: 'Lottery (00-99)',
      numbers: 'Numbers (1-100)',
      shareWheel: 'Share This Wheel',
      copyLink: 'Copy Link',
      resetAllCounts: 'Reset All Counts',
      deleteAllChoices: 'Delete All Choices',
      wheelName: 'Wheel Name',
      save: 'Save',
      load: 'Load',
      reset: 'Reset',
      savedWheels: 'Saved Wheels',
      noSavedWheels: 'No saved wheels yet',
      options: 'options',
      deleteConfirm: 'Are you sure you want to DELETE ALL options? This cannot be undone!',
      allUsedUp: 'All options have been used up! Please reset or add new options.',
      linkCopied: '✅ Link copied to clipboard! Share it with your friends.',
      linkCopyFailed: '❌ Failed to copy link. Please copy it manually.',
      wheelSaved: 'Wheel saved successfully! ✅',
      deleteWheelConfirm: 'Delete this wheel?',
      wheelDeleted: 'Wheel deleted',
      signInToSave: 'Please sign in to save wheels',
      enterWheelName: 'Please enter a wheel name',
      pasteListPlaceholder: 'Paste your list here (one item per line, or comma-separated)\nExample:\nPizza\nBurger\nSushi',
      addAllItems: 'Add All Items',
      cancel: 'Cancel'
    },
    th: {
      title: 'วงล้อหมุน',
      description: 'เพิ่มตัวเลือกและหมุนเพื่อสุ่มเลือก',
      spin: 'หมุน',
      spinning: '...',
      unmute: 'เปิดเสียง',
      mute: 'ปิดเสียง',
      result: 'ผลลัพธ์',
      manageOptions: 'จัดการตัวเลือก',
      hideList: 'ซ่อนรายการ',
      showList: 'แสดงรายการ',
      enterNewOption: 'พิมพ์ตัวเลือกใหม่...',
      maxUses: 'จำนวนครั้ง',
      addOption: 'เพิ่มตัวเลือก',
      bulkAdd: 'เพิ่มเป็นชุด (วางรายการ)',
      hide: 'ซ่อน',
      setSelectionLimit: 'กำหนดจำนวนครั้งสูงสุด (ยกเลิกเครื่องหมายเพื่อไม่จำกัด)',
      quickLoadPresets: 'โหลดตัวอย่างด่วน',
      thaiFood: 'อาหารไทย',
      partyGames: 'เกมปาร์ตี้',
      lottery: 'ลอตเตอรี่ (00-99)',
      numbers: 'ตัวเลข (1-100)',
      shareWheel: 'แชร์วงล้อนี้',
      copyLink: 'คัดลอกลิงก์',
      resetAllCounts: 'รีเซ็ตจำนวนครั้งทั้งหมด',
      deleteAllChoices: 'ลบตัวเลือกทั้งหมด',
      wheelName: 'ชื่อวงล้อ',
      save: 'บันทึก',
      load: 'โหลด',
      reset: 'รีเซ็ต',
      savedWheels: 'วงล้อที่บันทึก',
      noSavedWheels: 'ยังไม่มีวงล้อที่บันทึก',
      options: 'ตัวเลือก',
      deleteConfirm: 'คุณแน่ใจหรือไม่ว่าต้องการลบตัวเลือกทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้!',
      allUsedUp: 'ตัวเลือกทั้งหมดถูกใช้หมดแล้ว! กรุณารีเซ็ตหรือเพิ่มตัวเลือกใหม่',
      linkCopied: '✅ คัดลอกลิงก์แล้ว! แชร์ให้เพื่อนของคุณ',
      linkCopyFailed: '❌ ไม่สามารถคัดลอกลิงก์ได้ กรุณาคัดลอกด้วยตนเอง',
      wheelSaved: 'บันทึกวงล้อสำเร็จ! ✅',
      deleteWheelConfirm: 'ลบวงล้อนี้?',
      wheelDeleted: 'ลบวงล้อแล้ว',
      signInToSave: 'กรุณาเข้าสู่ระบบเพื่อบันทึกวงล้อ',
      enterWheelName: 'กรุณาใส่ชื่อวงล้อ',
      pasteListPlaceholder: 'วางรายการของคุณที่นี่ (หนึ่งรายการต่อบรรทัด หรือคั่นด้วยจุลภาค)\nตัวอย่าง:\nพิซซ่า\nเบอร์เกอร์\nซูชิ',
      addAllItems: 'เพิ่มทั้งหมด',
      cancel: 'ยกเลิก'
    }
  };

  const t = translations[language];

  // ============================================
  // EFFECTS
  // ============================================


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserWheels(currentUser.uid);
      } else {
        setSavedWheels([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load options from localStorage on mount
  useEffect(() => {
    const savedOptions = localStorage.getItem('wheelOptions');
    const savedWheelName = localStorage.getItem('wheelName');

    if (savedOptions) {
      try {
        setOptions(JSON.parse(savedOptions));
      } catch (error) {
        console.error('Error loading saved options:', error);
      }
    }

    if (savedWheelName) {
      setWheelName(savedWheelName);
    }
  }, []);

  // Save options to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wheelOptions', JSON.stringify(options));
  }, [options]);

  // Save wheel name to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wheelName', wheelName);
  }, [wheelName]);

  // Load from URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const listParam = urlParams.get('list');

    if (listParam) {
      try {
        const items = decodeURIComponent(listParam).split(',').filter(item => item.trim() !== '');
        if (items.length > 0) {
          const newOptions = items.map(item => ({
            name: item.trim(),
            maxSelections: Infinity,
            timesSelected: 0
          }));
          setOptions(newOptions);
        }
      } catch (error) {
        console.error('Error loading from URL:', error);
      }
    }
  }, []);

  // ============================================
  // WHEEL FUNCTIONS
  // ============================================

  const loadUserWheels = async (userId) => {
    try {
      const wheels = await getUserWheels(userId);
      setSavedWheels(wheels);
    } catch (error) {
      console.error("Error loading wheels:", error);
    }
  };

  const handleDeleteAllOptions = () => {
    const confirmDelete = window.confirm(t.deleteConfirm);
    if (!confirmDelete) return;

    setOptions([]);
    setSelectedOption(null);
  };

  const handleAddOption = () => {
    if (newOption.trim() !== '') {
      const newOptionObj = {
        name: newOption,
        maxSelections: isLimitEnabled ? (maxSelections || 1) : Infinity,
        timesSelected: 0
      };
      setOptions([...options, newOptionObj]);
      setNewOption('');
    }
  };

  const handleBulkAdd = () => {
    if (bulkInput.trim() === '') return;

    // Split by newlines, commas, or semicolons and filter empty strings
    const items = bulkInput
      .split(/[\n,;]+/)
      .map(item => item.trim())
      .filter(item => item !== '');

    const newOptions = items.map(item => ({
      name: item,
      maxSelections: isLimitEnabled ? (maxSelections || 1) : Infinity,
      timesSelected: 0
    }));

    setOptions([...options, ...newOptions]);
    setBulkInput('');
    setShowBulkInput(false);
  };

  const loadPreset = (presetName) => {
    const presets = {
      thaiFood: [
        'ข้าวผัดกระเพรา (Pad Kra Pao)',
        'ก๋วยเตี๋ยวเนื้อ (Noodle Soup)',
        'ชาบู (Shabu)',
        'หมูกระทะ (Mookrata)',
        'ส้มตำ (Som Tum)',
        'ผัดไทย (Pad Thai)',
        'ข้าวมันไก่ (Chicken Rice)',
        'ต้มยำกุ้ง (Tom Yum)'
      ],
      party: [
        'Truth',
        'Dare',
        'Drink 🍺',
        'Dance 💃',
        'Sing 🎤',
        'Skip Turn',
        'Choose Someone',
        'Wild Card 🎲'
      ],
      lottery: Array.from({ length: 100 }, (_, i) => String(i).padStart(2, '0')),
      numbers: Array.from({ length: 100 }, (_, i) => String(i + 1))
    };

    const preset = presets[presetName];
    if (preset) {
      const newOptions = preset.map(item => ({
        name: item,
        maxSelections: Infinity,
        timesSelected: 0
      }));
      setOptions(newOptions);
      setWheelName(
        presetName === 'thaiFood' ? 'Thai Food 🍜' :
        presetName === 'party' ? 'Party Games 🎉' :
        presetName === 'lottery' ? 'Lottery (00-99) 🎰' :
        'Numbers (1-100) 🔢'
      );
    }
  };

  const handleRemoveOption = (indexToRemove) => {
    const updatedOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(updatedOptions);
  };

  const handleResetCounts = () => {
    const resetOptions = options.map(opt => ({
      ...opt,
      timesSelected: 0
    }));
    setOptions(resetOptions);
    setSelectedOption(null);
  };

  const generateShareUrl = () => {
    const optionNames = options.map(opt => opt.name).join(',');
    const encodedList = encodeURIComponent(optionNames);
    const baseUrl = window.location.origin + window.location.pathname;
    const url = `${baseUrl}?list=${encodedList}`;
    setShareUrl(url);
    setShowShareUrl(true);
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(t.linkCopied);
    }).catch(() => {
      alert(t.linkCopyFailed);
    });
  };

  const playTickSound = () => {
    if (isMuted) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playWinSound = () => {
    if (isMuted) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 523.25; // C5
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      // Second note
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 659.25; // E5
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.45);
      osc2.start(audioContext.currentTime + 0.15);
      osc2.stop(audioContext.currentTime + 0.45);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const spinWheel = () => {
    if (isSpinning || options.length === 0) return;

    const availableOptions = options
      .map((option, index) => ({ ...option, index }))
      .filter(opt => opt.timesSelected < opt.maxSelections);

    if (availableOptions.length === 0) {
      alert(t.allUsedUp);
      return;
    }

    setIsSpinning(true);
    setSelectedOption(null);
    setShowFirework(false);
    setWinningSegmentIndex(null);

    // Play ticking sound during spin
    const tickInterval = setInterval(() => {
      playTickSound();
    }, 100);

    // 1. First, decide who the winner is from the available options
    const winner = availableOptions[Math.floor(Math.random() * availableOptions.length)];
    const winningIndex = winner.index;

    // 2. Then, calculate the rotation to land on the winner
    const anglePerOption = 360 / options.length;

    // Calculate the target angle. The pointer is at 12 o'clock.
    // We add a small random offset so it doesn't stop at the exact same spot every time.
    const randomOffset = (Math.random() - 0.5) * anglePerOption * 0.8;
    const targetSegmentCenter = winningIndex * anglePerOption;
    const targetAngle = targetSegmentCenter + randomOffset;

    // This is the final angle (0-360) we want the wheel to be rotated to.
    const finalRotationAngle = (360 - targetAngle) % 360;

    // Add multiple spins for visual effect
    const minSpins = 5;
    const maxSpins = 10;
    const randomSpins = Math.floor(minSpins + Math.random() * (maxSpins - minSpins));
    
    // Calculate a total rotation that will result in `finalRotationAngle` after the modulo.
    // This ensures the wheel always spins forward and completes full spins before landing.
    const currentVisualRotation = rotation % 360;
    const totalRotation = rotation - currentVisualRotation + (randomSpins * 360) + finalRotationAngle;
    
    setRotation(totalRotation);

    // 3. After the animation, update the state with the pre-determined winner
    setTimeout(() => {
      clearInterval(tickInterval); // Stop ticking sound
      playWinSound(); // Play winner sound

      const updatedOptions = options.map((opt, idx) => {
        if (idx === winningIndex) {
          return {
            ...opt,
            timesSelected: opt.timesSelected + 1
          };
        }
        return opt;
      });

      setOptions(updatedOptions);
      setSelectedOption(options[winningIndex].name);
      setWinningSegmentIndex(winningIndex);
      setShowFirework(true);
      setIsSpinning(false);

      // Hide firework after animation completes
      setTimeout(() => {
        setShowFirework(false);
      }, 2000);
    }, 4000);
  };

  const handleSaveWheel = async () => {
    if (!user) {
      setError(t.signInToSave);
      return;
    }

    if (!wheelName.trim()) {
      setError(t.enterWheelName);
      return;
    }

    try {
      await saveWheel(user.uid, wheelName, options);
      setError('');
      alert(t.wheelSaved);
      loadUserWheels(user.uid);
    } catch (error) {
      console.error('Error saving wheel:', error);
      setError('Failed to save wheel. Please try again.');
    }
  };

  const handleLoadWheel = (wheel) => {
    setWheelName(wheel.name);
    setOptions(wheel.options);
    setShowSaved(false);
    setSelectedOption(null);
    setError('');
  };

  const handleDeleteWheel = async (wheel) => {
    if (!user) {
      setError('You must be logged in to delete wheels');
      return;
    }

    if (!window.confirm(t.deleteWheelConfirm)) return;

    try {
      await deleteWheel(wheel.id);
      loadUserWheels(user.uid);
      alert(t.wheelDeleted);
    } catch (error) {
      console.error('Error deleting wheel:', error);
      setError('Failed to delete wheel');
    }
  };

  const handleReset = () => {
    setOptions([
      { name: 'Pizza 🍕', maxSelections: 3, timesSelected: 0 },
      { name: 'Burger 🍔', maxSelections: 3, timesSelected: 0 },
      { name: 'Sushi 🍣', maxSelections: 3, timesSelected: 0 },
      { name: 'Pasta 🍝', maxSelections: 3, timesSelected: 0 },
      { name: 'Salad 🥗', maxSelections: 3, timesSelected: 0 },
      { name: 'Tacos 🌮', maxSelections: 3, timesSelected: 0 },
      { name: 'Ramen 🍜', maxSelections: 3, timesSelected: 0 },
      { name: 'Steak 🥩', maxSelections: 3, timesSelected: 0 }
    ]);
    setWheelName('My Wheel');
    setSelectedOption(null);
    setRotation(0);
    setError('');
  };

  // ============================================
  // RENDER
  // ============================================

  const colorSchemes = {
    rainbow: [
      'linear-gradient(135deg, #FF0080 0%, #FF0000 100%)',
      'linear-gradient(135deg, #FF4500 0%, #FF8C00 100%)',
      'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      'linear-gradient(135deg, #00FF00 0%, #32CD32 100%)',
      'linear-gradient(135deg, #00CED1 0%, #1E90FF 100%)',
      'linear-gradient(135deg, #4169E1 0%, #0000FF 100%)',
      'linear-gradient(135deg, #8A2BE2 0%, #9400D3 100%)',
      'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
    ],
    pastel: [
      'linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 100%)',
      'linear-gradient(135deg, #FFFFBA 0%, #BAFFC9 100%)',
      'linear-gradient(135deg, #BAE1FF 0%, #E0BBE4 100%)',
      'linear-gradient(135deg, #FEC8D8 0%, #FFDFD3 100%)',
      'linear-gradient(135deg, #D4F1F4 0%, #C9E4E7 100%)',
      'linear-gradient(135deg, #F7D9C4 0%, #FAEDCB 100%)',
      'linear-gradient(135deg, #C9E4DE 0%, #E8DDCB 100%)',
      'linear-gradient(135deg, #E8C1C5 0%, #D9BFD9 100%)',
    ],
    vibrant: [
      'linear-gradient(135deg, #FF006E 0%, #FB5607 100%)',
      'linear-gradient(135deg, #FFBE0B 0%, #FF006E 100%)',
      'linear-gradient(135deg, #8338EC 0%, #3A86FF 100%)',
      'linear-gradient(135deg, #06FFA5 0%, #FFFB0B 100%)',
      'linear-gradient(135deg, #FF0A54 0%, #FF477E 100%)',
      'linear-gradient(135deg, #00F5FF 0%, #0099FF 100%)',
      'linear-gradient(135deg, #B537F2 0%, #FF0099 100%)',
      'linear-gradient(135deg, #00FFB3 0%, #00D4AA 100%)',
    ],
    ocean: [
      'linear-gradient(135deg, #006994 0%, #0090C1 100%)',
      'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
      'linear-gradient(135deg, #48CAE4 0%, #00B4D8 100%)',
      'linear-gradient(135deg, #90E0EF 0%, #48CAE4 100%)',
      'linear-gradient(135deg, #00B4D8 0%, #023E8A 100%)',
      'linear-gradient(135deg, #0096C7 0%, #0077B6 100%)',
      'linear-gradient(135deg, #CAF0F8 0%, #90E0EF 100%)',
      'linear-gradient(135deg, #023E8A 0%, #03045E 100%)',
    ],
    sunset: [
      'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      'linear-gradient(135deg, #F7931E 0%, #FDC830 100%)',
      'linear-gradient(135deg, #FDC830 0%, #F37335 100%)',
      'linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)',
      'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 100%)',
      'linear-gradient(135deg, #FF8C42 0%, #FF3C38 100%)',
      'linear-gradient(135deg, #FFAFBD 0%, #FFC3A0 100%)',
      'linear-gradient(135deg, #ED213A 0%, #93291E 100%)',
    ],
    forest: [
      'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
      'linear-gradient(135deg, #396362 0%, #4E9F3D 100%)',
      'linear-gradient(135deg, #2C5F2D 0%, #97BC62 100%)',
      'linear-gradient(135deg, #1E5128 0%, #4E9F3D 100%)',
      'linear-gradient(135deg, #D8E9A8 0%, #4E9F3D 100%)',
      'linear-gradient(135deg, #52796F 0%, #84A98C 100%)',
      'linear-gradient(135deg, #40916C 0%, #52B788 100%)',
      'linear-gradient(135deg, #74C69D 0%, #B7E4C7 100%)',
    ]
  };

  const rainbowColors = customColors ? colorSchemes[customColors] : colorSchemes.rainbow;

  return (
    <div className={`component-page ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">🎲</span>
          {t.title}
        </h1>
        <p className="page-description">
          {t.description}
        </p>
      </div>

      {/* Main Content */}
      <div className="wheel-container">
        <div className="pointer-container">
          <div className="pointer-arrow">▼</div>
          <div className="pointer-line"></div>
        </div>

        <div
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
          }}
        >
          {options.map((option, index) => {
            const angle = (360 / options.length) * index;
            const background = rainbowColors[index % rainbowColors.length];
            const segmentAngle = 360 / options.length;

            // Calculate clip-path for the segment
            const halfAngle = segmentAngle / 2;
            const halfAngleRad = (halfAngle * Math.PI) / 180;
            const x1 = 50 + 50 * Math.sin(-halfAngleRad);
            const y1 = 50 - 50 * Math.cos(-halfAngleRad);
            const x2 = 50 + 50 * Math.sin(halfAngleRad);
            const y2 = 50 - 50 * Math.cos(halfAngleRad);

            const clipPath = `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`;

            const isWinningSegment = showFirework && index === winningSegmentIndex;

            return (
              <div
                key={index}
                className={`wheel-segment ${isWinningSegment ? 'winning-segment' : ''}`}
                style={{
                  transform: `rotate(${angle}deg)`,
                  background: background,
                  opacity: 1,
                  clipPath: clipPath
                }}
              >
                {showOptionsOnWheel && (
                  <div className="wheel-text">
                    <span className="option-text">{option.name}</span>
                  </div>
                )}
                {isWinningSegment && (
                  <div className="firework-container">
                    <div className="firework"></div>
                    <div className="firework"></div>
                    <div className="firework"></div>
                  </div>
                )}
              </div>
            );
          })}

          <button
            className="wheel-center"
            onClick={spinWheel}
            disabled={isSpinning || options.length === 0}
          >
            <span>{isSpinning ? t.spinning : t.spin}</span>
          </button>
        </div>
      </div>

      <div className="spin-controls">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="mute-button"
          title={isMuted ? t.unmute : t.mute}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {showColorPicker && (
        <div className="color-picker-panel">
          <h3>Choose Color Scheme</h3>
          <div className="color-presets">
            <button onClick={() => setCustomColors(null)} className="preset-color-btn">
              🌈 Rainbow (Default)
            </button>
            <button onClick={() => setCustomColors('pastel')} className="preset-color-btn">
              🌸 Pastel
            </button>
            <button onClick={() => setCustomColors('vibrant')} className="preset-color-btn">
              ⚡ Vibrant
            </button>
            <button onClick={() => setCustomColors('ocean')} className="preset-color-btn">
              🌊 Ocean
            </button>
            <button onClick={() => setCustomColors('sunset')} className="preset-color-btn">
              🌅 Sunset
            </button>
            <button onClick={() => setCustomColors('forest')} className="preset-color-btn">
              🌲 Forest
            </button>
          </div>
          <button onClick={() => setShowColorPicker(false)} className="close-color-picker">
            ✕ Close
          </button>
        </div>
      )}

      {selectedOption && !isSpinning && (
        <div className="result">
          <h2>🎉 {t.result}: {selectedOption}</h2>
        </div>
      )}

      <div className="options-manager">
        <div className="options-header">
          <h3>{t.manageOptions}</h3>
          <button
            onClick={() => setShowOptionsList(!showOptionsList)}
            className="toggle-list-button"
          >
            {showOptionsList ? `🔼 ${t.hideList}` : `🔽 ${t.showList}`}
          </button>
        </div>

        {showOptionsList && (
          <>
            <div className="add-option-container">
              <div className="add-option">
                <input
                  type="text"
                  placeholder={t.enterNewOption}
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                />
                <div className="number-input-wrapper">
                  <button
                    className="number-btn"
                    onClick={() => setMaxSelections(Math.max(1, (maxSelections || 1) - 1))}
                    disabled={!isLimitEnabled || maxSelections <= 1}
                    type="button"
                  >
                    ▼
                  </button>
                  <input
                    type="number"
                    placeholder={t.maxUses}
                    value={maxSelections}
                    max="999"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || val === null) {
                        setMaxSelections('');
                      } else {
                        const num = parseInt(val);
                        if (!isNaN(num) && num >= 0 && num <= 999) {
                          setMaxSelections(num);
                        }
                      }
                    }}
                    className="max-selections-input"
                    disabled={!isLimitEnabled}
                    inputMode="numeric"
                  />
                  <button
                    className="number-btn"
                    onClick={() => setMaxSelections(Math.min(999, (maxSelections || 0) + 1))}
                    disabled={!isLimitEnabled || maxSelections >= 999}
                    type="button"
                  >
                    ▲
                  </button>
                </div>
                <button onClick={handleAddOption}>{t.addOption}</button>
              </div>

              <button
                onClick={() => setShowBulkInput(!showBulkInput)}
                className="bulk-input-toggle"
              >
                📋 {showBulkInput ? t.hide : t.bulkAdd}
              </button>

              {showBulkInput && (
                <div className="bulk-input-container">
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder={t.pasteListPlaceholder}
                    className="bulk-input-textarea"
                    rows="6"
                  />
                  <div className="bulk-input-actions">
                    <button onClick={handleBulkAdd} className="btn-primary">
                      ✅ {t.addAllItems}
                    </button>
                    <button
                      onClick={() => {
                        setBulkInput('');
                        setShowBulkInput(false);
                      }}
                      className="btn-secondary"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}

              <div className="limit-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={isLimitEnabled}
                    onChange={(e) => setIsLimitEnabled(e.target.checked)}
                  />
                  <span>{t.setSelectionLimit}</span>
                </label>
              </div>
            </div>

            {/* Thai Presets Section */}
            <div className="presets-section">
              <h4 className="presets-title">{t.quickLoadPresets}</h4>
              <div className="presets-grid">
                <button onClick={() => loadPreset('thaiFood')} className="preset-btn">
                  🍜 {t.thaiFood}
                </button>
                <button onClick={() => loadPreset('party')} className="preset-btn">
                  🎉 {t.partyGames}
                </button>
                <button onClick={() => loadPreset('lottery')} className="preset-btn">
                  🎰 {t.lottery}
                </button>
                <button onClick={() => loadPreset('numbers')} className="preset-btn">
                  🔢 {t.numbers}
                </button>
              </div>
            </div>

            <button onClick={generateShareUrl} className="share-button">
              🔗 {t.shareWheel}
            </button>

            {showShareUrl && (
              <div className="share-url-container">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="share-url-input"
                  onClick={(e) => e.target.select()}
                />
                <button onClick={copyShareUrl} className="copy-btn">
                  📋 {t.copyLink}
                </button>
              </div>
            )}

            <button onClick={handleResetCounts} className="reset-button">
              🔄 {t.resetAllCounts}
            </button>

            <button onClick={handleDeleteAllOptions} className="delete-all-button">
              🗑️ {t.deleteAllChoices}
            </button>

            <div className="options-list">
              {options.map((option, index) => {
                const isUnlimited = option.maxSelections === Infinity;
                return (
                  <div key={index} className="option-item">
                    <div className="option-info">
                      <span className="option-name">{option.name}</span>
                      <span className="option-counter">
                        ({isUnlimited ? `${option.timesSelected}/∞` : `${option.timesSelected}/${option.maxSelections}`})
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="delete-button"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Save/Load Section */}
      {user && (
        <div className="save-section">
          <div className="input-section">
            <label className="input-label">{t.wheelName}</label>
            <input
              type="text"
              value={wheelName}
              onChange={(e) => setWheelName(e.target.value)}
              className="input-field"
              placeholder="Enter wheel name..."
              maxLength={100}
            />
          </div>

          <div className="button-row">
            <button onClick={handleSaveWheel} className="btn btn-secondary">
              💾 {t.save}
            </button>
            <button onClick={() => setShowSaved(!showSaved)} className="btn btn-secondary">
              📂 {t.load}
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              🔄 {t.reset}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Saved Wheels */}
          {showSaved && (
            <div className="saved-wheels">
              <h3 className="saved-title">{t.savedWheels} ({savedWheels.length})</h3>
              {savedWheels.length === 0 ? (
                <p className="empty-message">{t.noSavedWheels}</p>
              ) : (
                <div className="saved-list">
                  {savedWheels.map((wheel) => (
                    <div key={wheel.id} className="saved-item">
                      <div onClick={() => handleLoadWheel(wheel)} className="saved-info">
                        <span className="saved-name">{wheel.name}</span>
                        <span className="saved-count">{wheel.options.length} {t.options}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteWheel(wheel)}
                        className="btn-icon-danger"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SpinningWheel;
