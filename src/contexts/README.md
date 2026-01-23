# Auth Context

Context di autenticazione Firebase integrato nell'app.

## Utilizzo

```tsx
import { useAuth } from "@/contexts/authContext";

export default function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Text>Non autenticato</Text>;
  }

  return (
    <View>
      <Text>Bentornato, {user.email}</Text>
    </View>
  );
}
```

## API

- `user`: Utente corrente Firebase (null se non autenticato)
- `loading`: Indica se lo stato di autenticazione è in caricamento

## Funzioni disponibili

Importa le funzioni dal servizio auth:

```tsx
import { signIn, signUp, logout, resetPassword } from "@/services/auth.service";
```
