# Frontend

React + JavaScript single-page application for Brooks School.

## Initial Structure

```text
src/
  app/
  api/
  auth/
  components/
    ui/
  features/
    auth/
    students/
    teachers/
    classes/
    subjects/
    grades/
    attendance/
    dashboard/
  layouts/
  routes/
  styles/
tests/
```

## State Management

TanStack Query will own server state, caching, invalidation, pagination, and mutations. Local React state will handle view state such as dialogs, active tabs, and form UI.
