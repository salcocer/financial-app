# Part 1. RN fundamentals

1. how does RN actually get a component onto the screen ?

When i write a component R runs it on the js thread and produces a tree of elements.
On every update the reconciler diffs the new tree against the old one. to rerender what
changed.

With the new architecture the render is FABRIC. It turns into a shadow tree in C++.
Then those changes get committed to real native views on the main thread, so a <View>
ends up as a real UIView and a android.view.View

Its a real native UI and the JS describes what it should look like.

Can be slow if theres to much work on the JS thread, or too many views to lay out and mount.

2. useEffect, useLayoutEffect, useMemo and useCallBack

useEffect runs after the screen is painted/mounted. Its for side effects like fetching
data or subscribing to something, and I always return a cleanup so i dont leak listeners
or set state after unmount.

useLayoutEffect runs after layout but before paint, so I only use it when I need to measure something and adjust before the user sees a flicker. It block paint, so I keep it light.

useMemo caches a computed value.

useCallBack caches a function reference.

3. Whats a stale closure ?

An effect or callback captures and old value of state.
setCount(c => c + 1)

4. What causes a component to re-render and do you avoid unnecessary re-renders?

A component re-renders when its state changes, when its parent re-renders or when
a context it reads changes.

The parent one: the child re-renders even if its props didn't change, unless it's
wrapped in React.memo.

To avoid re-renders, first I keep state as close as possible to where its used, so a
change doesn't re-render half the screen.

For global state I use selectors, with Zustand or Redux 'useSelector' so a component
only re-renders when its slice changes.

And split contexts, because one big context re-renders every consumer.

Whats a React Compiler ? a build-time tool from the React team that memoizes automatically, so less manual `useMemo/useCallback`.

5. ScrollView vs FlatList vs FlashList ?

ScrollView renders all its children at once, so it's fine for a short, fixed screen like a settings page but terrible for long data.

FlatList virtualizes: it only renders what's near the viewport and unmounts whats far away. It tune it with a stable `keyExtractor`, `getItemLayout` if rows have a fixed
height so it doesn't need to measure, `windowSize` and `initialNumToRender` and a memoized row component.

FlashList -> Shopify build

6. How do you handle navigation ?

Expo Router. File-based.
Typed route params, deep linking config, and separate stacks for logged-out and logged-in users.
On logout I reset navigation state instead of just navigation back, so the user can't go back into authenticated screens.

10. Explain the New Architecture.

It has four main pieces.

JSI is the base. Its a C++ interfacde that lets JS hold direct references to native
objects and call their methods, even synchronously without json serialization.

TurboModules are native modules built on JSI. They load lazy, only when you first use
them, which helps startup and they're typed.

Fabric is the new renderer. The shadow tree lives in C++, layout can be asynchronous when needed, and it supports React's concurrent features like transitions.

CodeGen takes a typed Typescript spec and generates the native interface code, so the JS and native sides can't drift apart.

Its been the default since ReactNative 0.76

11. How would you expose a native Swfit SDK to JavaScript ?

With TurboModule, I start with Typescript spec that defines the API. Codegen generates
the native protocol. On iOs the generated code is ObjectiveC++ so the usual approach is
a small .mm file that implements the protocol and calls into my Swift class.

The easir modern option is the EXPO MODULES API where I write the module directly in
Swift and Kotlin with a small DSL.

I make sure heavy work runs off the main thread and returns results as a Promise or
send events for things that happen overtime.

```
// NativeBiometrics.ts : The spec Codegen Reads

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    isAvailable(): Promise<boolean>;
    authenticate(reason: string): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Biometrics');

```

Follow-up: How do you send events from native to JS ? Event emitters. On the JS side
you subscribe in `useEffect` and remove the listeners in the cleanup.

12. What is HERMES ?

Hermes is a js engine built by Meta specifically for RN.
Compiles JS to bytecode at build time.
So apps start faster and use less memory.
Its the default engine now.

13. What native iOS stuff are you comfortable with ?

RN dev touches regularly:
Info.plist for permissions and URL schemes.
Podfile and pod install issues, schemes and build configs.
Signin and provisioning. Reading crash logs in Xcode.

Native module in Swift.

17. "How do you find memory leaks?"

How to answer:

"In RN they usually come from listeners or subscriptions without cleanup, timers that aren't cleared, or closures holding big objects. So first I check effects for missing cleanups. For tools, Xcode's Memory Graph and Instruments on iOS, the Android Studio memory profiler, and Hermes heap snapshots to compare memory before and after navigating in and out of a screen several times. If memory keeps growing, something isn't being released."

19. "How do you monitor performance in production?"

How to answer:

"With something like Sentry, Firebase Performance or Datadog: app start time, slow and frozen frames, ANRs on Android, and crash-free sessions per release. Ideally with a performance budget, so a release that makes startup 20% slower gets flagged before it goes out to everyone, combined with staged rollouts."

20. Typescript 'type' vs 'interface'

For objects shapes they're mostly interchangeable.
`interface` can be extended and declaration-merged, which is useful for library typings.
`type` can also do unions, intersections, mapped and conditional types.

21. 'any' vs 'unknown' vs 'never'

`any` switches type checking off, so I avoid it.

`unknown` means could be anything, but you must check before using it, so its safe choice for API responses and `catch` errors.

`never` is a value that can't exist.

I use it for exhaustive checks, so the compiler tells me if I forgot a case.

```
try{
    await submitLoan();
} catch (e: unknown){
    if(e instead ApiError) showError(e.message);
    else showError('Something went wrong');
}
```

22. Whats a discriminated union? Give a real example.

This is the best TS pattern for UI state.

Its a union of types that share a literal field, so TS can narrow based on that field.
I use it for screen state instead of separate booleans, because with `isLoading`, `error` and `data` as separate fields you can end up in imposible states, like loading and error at the same time.

```
type LoanState =
| { status: 'idle' }
| { status: 'loading' }
| { status: 'approved'; amount: number }
| { status: 'rejected'; reason: string };

function render(state: LoanState) {
    switch(state.status){
        case 'approved': return `Approved: ${state.amount}`;
        case 'rejected': return state.reason;
        case 'loading': return null;
        default: {}
    }
}

```

23. Explains generics with a real example

Generics let me write code that works with `any` type while keeping the type information.

For ex. a reusable list component: I don't want `any` for the items, I want the type
to flow through to `renderItem`.

```

type ListProps<T extends {id: string}> = {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}

function List<T extends {id: string}>({items, renderItem}: ListProps<T>) {
    return <>{items.map(i) => <Fragment key={i.id}>{renderItem(i)}</>}</>
}

```

The `extends {id: string}` constraint guarantees I can use `id` as the key, and the caller gets full autocomplete on their item type.

30. "Where do you store auth tokens?"

"In the Keychain on iOS and Keystore-backed storage on Android, using react-native-keychain or expo-secure-store. Never AsyncStorage, which is plain unencrypted storage. If I need to store more local data encrypted, MMKV supports encryption, and I keep its key in the Keychain."

31. "How would you implement biometric login?"

How to answer:

"The naive way is to call a biometrics API, get true or false in JS, and then let the user in. But that check can be bypassed on a compromised device. The better approach is to store the refresh token in the Keychain with access control that requires biometrics, so the OS only releases the secret after a successful Face ID or fingerprint check. I'd also add a PIN fallback, and handle biometrics changing: if someone adds a new fingerprint, the key should be invalidated."

33. "How do you protect sensitive data on screen and in logs?"

How to answer:

"Hide sensitive screens when the app goes to the background, so the app switcher snapshot doesn't show balances. Block screenshots on sensitive screens on Android with FLAG_SECURE. Never log PII or tokens, including in Sentry breadcrumbs and analytics. Mask things like IBANs. And clear everything on logout."

35. useDebounce

```
function useDebounce<T>(value:T, delay=300): T {
    const [debounce, setDebounce] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounce(value), delay);
        return () => clearTimeout(id);
    },[value, delay])
    return debounce;
}
```

Every time the value changes, I start a timer. If it changes again before the timer fires, the cleanup cancels the old timer. So the debounced value only updates once the user stops typing.
