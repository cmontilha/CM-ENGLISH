import AsyncStorage from "@react-native-async-storage/async-storage";

const DEVICE_ID_KEY = "voice_chat_device_id";

const generateId = () =>
  `device_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

export const getOrCreateDeviceId = async () => {
  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) return stored;
  const nextId = generateId();
  await AsyncStorage.setItem(DEVICE_ID_KEY, nextId);
  return nextId;
};
