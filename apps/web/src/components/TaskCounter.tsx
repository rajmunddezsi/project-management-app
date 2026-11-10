import { useState } from 'react';

export default function TaskCounter() {
  const [count, setCount] = useState<number>(0);

  function handleAdd() {
    setCount((prevCount) => prevCount + 1);
  }

  function handleRemove() {
    if (count === 0) {
      return;
    }

    setCount((prevCount) => prevCount - 1);
  }

  function handleReset() {
    setCount(0);
  }

  return (
    <div>
      <div>{count}</div>
      <div>
        <button onClick={handleAdd}>Add task</button>
        <button onClick={handleRemove} disabled={count === 0}>
          Remove task
        </button>
        <button onClick={handleReset} disabled={count === 0}>
          Reset
        </button>
      </div>
    </div>
  );
}
