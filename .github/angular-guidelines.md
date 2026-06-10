# Angular 22 Modern Development Guidelines

## Objective

These instructions define the mandatory architectural rules, coding conventions, and best practices for developing modern Angular 22 applications.

The goal is to produce applications that are:

- Fully standalone
- Signal-first
- Zoneless-ready
- Strictly typed
- Reactive without RxJS overuse
- Future-proof
- Scalable and maintainable
- Optimized for performance
- Compatible with SSR/hydration where possible
- Following the latest Angular recommendations

These rules must always take precedence over legacy Angular patterns.

---

# Core Principles

## Always Prefer Modern Angular APIs

Use the newest stable Angular APIs and conventions.

Avoid legacy patterns unless absolutely required for compatibility.

Mandatory modern features:

- Standalone components
- Signals
- Signal-based state management
- Signal Forms
- inject()
- input()
- output()
- model()
- viewChild()
- contentChild()
- control flow syntax (@if, @for, @switch)
- Deferred loading with @defer
- provide* APIs
- Functional guards/interceptors/resolvers
- Zoneless change detection

Avoid:

- NgModules
- constructor injection
- @Input()
- @Output()
- *ngIf
- *ngFor
- *ngSwitch
- Template-driven forms
- Heavy RxJS patterns for local state
- Mutable shared state
- Any usage of any

---

# Application Architecture

## Standalone Architecture Only

The application must not use NgModules.

Every Angular artifact must be standalone (this is the default behavior since Angular v19 and no longer requires the standalone attribute).

Example:

```ts
@Component({
  selector: 'app-user-card',
  imports: [CommonModule],
  templateUrl: './user-card.component.html'
})
export class UserCardComponent {}
```

Rules:

- Never create AppModule.
- Never create feature modules.
- Never use SharedModule.
- Use direct component imports.
- Prefer feature-based folder organization.

---

## Recommended Folder Structure

```text
src/app/
 ├── core/
 │    ├── api/
 │    ├── auth/
 │    ├── config/
 │    ├── guards/
 │    ├── interceptors/
 │    ├── services/
 │    └── utils/
 │
 ├── shared/
 │    ├── components/
 │    ├── directives/
 │    ├── pipes/
 │    ├── models/
 │    └── ui/
 │
 ├── features/
 │    ├── users/
 │    ├── dashboard/
 │    └── settings/
 │
 ├── layouts/
 ├── app.routes.ts
 ├── app.config.ts
 └── main.ts
```

---

# Dependency Injection

## Use inject() Everywhere

Constructor injection is forbidden unless technically required.

Always use:

```ts
private readonly api = inject(ApiService);
```

Use:

```ts
protected readonly users = signal<User[]>([]);
```

for signals or members used in templates.

Benefits:

- Better tree-shaking
- More readable code
- Cleaner testing
- Better consistency with functional APIs

---

# State Management

## Signals First

Use signals as the default reactive primitive.

Prefer:

- signal()
- computed()
- linkedSignal()
- resource()
- rxResource()
- effect()

Avoid unnecessary RxJS subjects.

---

## Prefer resource() For Async UI State

Prefer:

```ts
readonly user = resource({
  loader: async () => {
    return await this.api.getUser();
  }
});
```

Rules:

- Prefer resource() or rxResource() for async state.
- Avoid manual loading/error boolean management when possible.
- Keep async state declarative.

---

## Rules for Signals

- Never mutate signal values directly.
- Always use set() or update().
- Keep computed() pure.
- Avoid effect() for state propagation.
- Prefer computed() over effect() whenever possible.
- Never emit outputs from effect().

Outputs should represent:

- Explicit user interactions
- Domain events
- Intentional application actions

---

## Prefer Signals Over RxJS for Local State

Signals are preferred for:

- Local UI state
- Derived state
- Component communication
- UI reactivity

RxJS is preferred for:

- HTTP orchestration
- WebSocket streams
- Cancellation
- Retries
- Debouncing
- Stream composition
- External library interoperability

Avoid:

- BehaviorSubject for component state
- Subject as event bus
- Manual subscriptions for local UI logic

---

# Signal Forms

## Use Signal Forms as the Default Form System

Signal Forms should be the default approach for forms.

Avoid:

- Template-driven forms
- Legacy Reactive Forms unless required

However, for very small forms (for example search inputs or simple filters), template-driven forms may still be acceptable.

Rules:

- Forms must be fully typed.
- Avoid untyped controls.
- Keep validation logic centralized.
- Prefer computed validation states.

---

# Component Design

## Components Must Be Small and Focused

Guidelines:

- Single responsibility
- Presentational components when possible
- Smart/container components only where needed
- Avoid god components
- Extract reusable UI pieces

Preferred maximum:

- 300-400 lines per component

---

## Prefer Composition Over Large Services

Prefer many small focused services over giant multi-purpose services.

Avoid:

- Huge UserService/AuthService files
- Mixed responsibilities
- Shared mutable service state

Prefer:

- Focused feature services
- Small API clients
- Dedicated state services
- Utility extraction

---

## Use input()/output()/model()

Never use decorators.

Preferred:

```ts
readonly user = input.required<User>();
readonly saved = output<User>();
readonly value = model<string>('');
```

Avoid:

```ts
@Input() user!: User;
@Output() saved = new EventEmitter<User>();
```

---

## Use Modern Queries

Preferred:

```ts
readonly inputRef = viewChild.required<ElementRef>('inputRef');
```

Avoid:

```ts
@ViewChild('inputRef') inputRef!: ElementRef;
```

---

# Templates

## Always Use New Control Flow Syntax

Use:

```html
@if (loading()) {
  <app-spinner />
}

@for (user of users(); track user.id) {
  <app-user-card [user]="user" />
}
```

Avoid legacy structural directives.

---

## Always Use Self-Closed Tags When Possible

Preferred:

```html
<app-user-card />
```

Avoid:

```html
<app-user-card></app-user-card>
```

unless content projection is required.

---

## Always Use track in @for

Never create loops without tracking.

Preferred:

```html
@for (item of items(); track item.id) {
```

Avoid:

```html
@for (item of items(); track $index) {
```

Use stable identifiers whenever possible.

---

# Change Detection

## Zoneless First

Applications should be designed to work without Zone.js, is the default for Angular 22.

Rules:

- Avoid relying on automatic dirty checking.
- Use signals to trigger updates.
- Avoid manual ChangeDetectorRef usage.
- Avoid detectChanges().
- Design fully reactive UIs.

---

# Routing

## Use provideRouter()

Preferred:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
});
```

Avoid RouterModule.

---

## Lazy Load Everything Possible

Use loadComponent or loadChildren.

---

## Use Functional Guards and Resolvers

Preferred:

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  return auth.isAuthenticated();
};
```

Avoid class-based guards.

---

# HTTP

## Use provideHttpClient()

Preferred:

```ts
provideHttpClient(
  withInterceptors([
    authInterceptor
  ])
)
```

In Angular 22 `withFetch()` is the default so is no longer needed.

---

## Use Functional Interceptors

Preferred:

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();

  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};
```

Avoid class interceptors.

---

# Performance

## Prefer Deferred Loading

Use @defer for heavy content.

---

## Prefer Computed State Over Imperative Logic

Prefer declarative derived state instead of manually recalculating values.

---

# TypeScript Rules

## Strict Mode Mandatory

Always enable:

```json
{
  "strict": true,
  "noImplicitOverride": true,
  "noPropertyAccessFromIndexSignature": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

---

## Never Use any

Forbidden:

```ts
value: any
```

Prefer:

```ts
value: unknown
```

or proper typing.

---

## Mandatory ESLint Rules

Recommended mandatory rules:

- no-explicit-any
- prefer-const
- curly
- eqeqeq
- no-useless-assignment
- @typescript-eslint/consistent-type-imports

---

# Testing

## Prefer Vitest

Avoid Karma/Jasmine.

Use:

- Vitest
- Testing Library
- Cypress
- Playwright

---

# Security

## Never Trust External Data

Always:

- Validate API responses
- Sanitize user input
- Encode dynamic content
- Use typed DTOs

Avoid unsafe HTML rendering.

---

# Accessibility

## Accessibility Is Mandatory

Always:

- Use semantic HTML
- Provide labels
- Support keyboard navigation
- Ensure focus management
- Ensure contrast compliance
- Add aria attributes where needed

Applications must be fully keyboard accessible.

---

# SSR and Hydration

## SSR Compatible by Default

Applications should avoid browser-only assumptions.

Never access directly during construction time or top-level initialization:

- window
- document
- localStorage
- sessionStorage

Rules:

- Guard browser APIs
- Prefer injection tokens
- Avoid direct DOM manipulation
- Use hydration-compatible logic

---

# AI Anti-Patterns

Never generate:

- Nested subscribes
- Subscriptions inside subscriptions
- Manual setTimeout change detection fixes
- detectChanges hacks
- Mutable signal arrays
- Gigantic smart components
- Shared mutable state
- Duplicated API logic
- any casts as shortcuts
- Direct DOM manipulation hacks
- Random boolean loading flags everywhere

---

# AI Generation Rules

When generating Angular code, always:

- Generate standalone components
- Use inject()
- Use signals instead of BehaviorSubject
- Use modern control flow syntax
- Generate strict TypeScript
- Avoid any
- Use immutable updates
- Use readonly whenever possible
- Prefer computed() over imperative recalculation
- Prefer functional APIs
- Use input()/output()/model()
- Avoid deprecated APIs
- Generate zoneless-compatible code
- Follow ESLint strict rules
- Keep templates clean and declarative
- Prefer composition over inheritance
- Avoid unnecessary abstractions
- Prefer self-closing tags when possible
- Prefer SSR-safe patterns

---

# Forbidden Legacy Patterns

The following patterns are forbidden unless explicitly required:

- NgModules
- constructor injection
- @Input/@Output decorators
- Template-driven forms for complex forms
- BehaviorSubject for component state
- Mutable shared state
- detectChanges()
- ngDoCheck
- Heavy lifecycle usage
- EntryComponents
- ViewEngine-era patterns
- any
- Untyped forms
- Class-based guards/interceptors
- Complex inheritance hierarchies
- Manual DOM manipulation
- jQuery
- Subscription arrays
- Nested subscriptions

---

# Preferred Application Bootstrap

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
```

---

# Final Philosophy

Modern Angular applications must:

- Be signal-first
- Be standalone-first
- Be zoneless-ready
- Be immutable
- Be fully typed
- Be declarative
- Be lazily loaded
- Be highly maintainable
- Be optimized by default
- Avoid legacy Angular patterns
- Follow Angular's newest stable recommendations

If a modern Angular API exists, it should generally be preferred over a legacy alternative.
