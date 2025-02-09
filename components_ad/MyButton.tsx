import { Pressable, Text } from 'react-native';

export default function MyButton({ title, onPress }) {
  return (
    <Pressable
      style={{
        backgroundColor: '#6200EE',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        width: 200,
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Text style={{ color: '#fff', fontSize: 18 }}>{title}</Text>
    </Pressable>
  );
}
