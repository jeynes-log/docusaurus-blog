---
slug: react-spread-props-위치
title: 'React props spread, 어디에 둘 것인가'
tags: [react, typescript]
---

shadcn/ui 코드를 보다가 잠깐 멈췄던 부분이 있었다. JSX에서는 뒤에 오는 prop이 앞을 덮어쓴다고 알고 있었는데, `Button` 컴포넌트는 `className`을 앞에 두고 `{...props}`를 뒤에 둔다.

```tsx
function Button({ className, variant, size, ...props }: ButtonProps) {
  return <ButtonPrimitive className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
```

처음엔 그냥 이렇게 생각했다.

> "어? 이거 사용자가 `className` 넘기면 덮어써지는 거 아냐?"

근데 다시 보니까 애초에 덮어쓸 대상이 없었다. `className`을 구조 분해로 미리 빼놨기 때문이다.

```tsx
function Button({ className, ...props }: ButtonProps);
```

여기서 이미 `className`은 따로 꺼내졌고, `props` 안에는 안 들어간다. 그러니까 뒤에서 `{...props}`를 spread해도 `className` 충돌 자체가 안 난다.

<!--truncate-->

## 규칙 자체는 단순하다

사실 JSX prop 충돌 규칙은 별거 없다.

뒤에 오는 값이 이긴다.

```tsx
<div className="foo" {...props} />
```

여기서 `props.className`이 있으면 `"foo"`를 덮어쓴다.

반대로:

```tsx
<div {...props} className="foo" />
```

이렇게 하면 마지막 `className="foo"`가 이긴다.

근데 여기서 하나 같이 들고 있어야 하는 조건이 있다.

> 그 키가 spread되는 객체 안에 실제로 있어야 한다.

이걸 빼먹으면 shadcn 코드가 좀 이상하게 보인다.

```tsx
const { className, ...rest } = props;

<div className="foo" {...rest} />;
```

이 경우엔 `rest.className`이 없으니까 뒤에 spread를 해도 충돌이 안 난다.

나도 처음엔 spread 위치만 보고 있었는데, 보다 보니까 내가 헷갈렸던 건 두 가지를 같이 생각하고 있어서였다.

- `className`을 구조 분해로 빼는 것
- spread를 앞에 둘지 뒤에 둘지

이 둘은 관련은 있지만 같은 문제는 아니다.

## 결국 spread 위치는 의도에 달려있다

그다음부터는 의외로 단순했다.

spread 위치는 결국 "누구 값을 최종적으로 살릴 거냐"의 문제다.

### `className`을 합치고 싶은 경우

이게 shadcn에서 가장 흔한 패턴이다.

```tsx
function Card({ className, ...props }: CardProps) {
  return <div className={cn('rounded-lg border p-4', className)} {...props} />;
}
```

`className`만 따로 빼서 `cn()`으로 합치고, 나머지는 그대로 넘긴다.

어차피 `className`은 rest에 없으니까 여기서는 spread 위치 때문에 충돌할 일도 없다.

### 사용자가 못 바꾸게 하고 싶은 경우

반대로 내부에서 강제로 고정해야 하는 값도 있다.

```tsx
function Dialog(props: DialogProps) {
  return <div {...props} role="dialog" aria-modal="true" />;
}
```

이 경우엔 `{...props}`를 앞에 둔다.

그래야 사용자가 `role="button"` 같은 걸 넘겨도 마지막 값이 덮어쓴다.

이건 의도적으로 override를 막는 패턴이다.

### 기본값만 깔아두고 싶은 경우

이건 더 단순하다.

```tsx
function Avatar(props: AvatarProps) {
  return <img width={40} height={40} {...props} />;
}
```

사용자가 `width`를 넘기면 기본값 40을 덮어쓴다.

spread를 뒤에 두는 것만으로 자연스럽게 동작한다.

## 정리

예전엔 spread 위치 자체를 외우려고 했는데, 지금은 먼저 이걸 생각하게 됐다.

> "이 prop은 누가 최종적으로 가져야 하지?"

- 사용자가 override할 수 있어야 하는지
- 내부에서 강제로 고정해야 하는지
- 아니면 `className`처럼 합쳐야 하는지

그걸 정하고 나면 spread 위치는 거의 따라온다.

다시 보니까 shadcn 코드도 그냥 충돌 자체가 안 생기게 만든 코드였다. `className`을 미리 rest에서 빼놨을 뿐.
