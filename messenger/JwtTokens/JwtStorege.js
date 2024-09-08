import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetToken = async () => {//получение токена из хранилища
    try {
        const token = await AsyncStorage.getItem('JwtToken');
        if (token !== null) {
            return token;
        }
    } catch (error) {
        console.error('Ошибка при извлечении токена:', error);
        return null;
    }
};

export const GetUserId = async () => {//получение токена из хранилища
    try {
        const id = await AsyncStorage.getItem('_id');
        if (id !== null) {
            return id;
        }
    } catch (error) {
        console.error('Ошибка при извлечении токена:', error);
    }
    return null;
};