import { useCallback, useState } from "react";
import useResource from "./lib/hooks/useResource";
import DataTable from "./lib/components/DataTable";
import type { ResourceParams } from "./lib/engine/source";
import "./App.css";

type Mode = "page" | "loadmore" | "infinite";
const MODES: Mode[] = ["page", "loadmore", "infinite"];
const TOTAL = 200;
const PAGE_SIZE = 20;

const ALL = Array.from({ length: TOTAL }, (_, i) => ({
  id: i + 1,
  todo: `Task number ${i + 1}`,
  completed: i % 3 === 0,
  userId: (i % 10) + 1,
}));

// Simulated API (the hosted demo can't call external APIs)
async function fakeApi({ page = 1, pageSize = PAGE_SIZE }: ResourceParams) {
  await new Promise((r) => setTimeout(r, 400));
  const skip = (page - 1) * pageSize;
  return ALL.slice(skip, skip + pageSize);
}

function Demo({ mode }: { mode: Mode }) {
  const source = useCallback(fakeApi, []);
  const r = useResource({
    source,
    pagination: { type: mode, pageSize: PAGE_SIZE },
    virtualization: { enabled: true, itemHeight: 50, containerHeight: 400 },
  });
  return (
    <DataTable
      data={r.data}
      loading={r.loading && r.totalItems === 0}
      error={r.error}
      page={r.page}
      setPage={r.setPage}
      setScrollTop={r.setScrollTop}
      type={mode}
      virtualization={true}
      offsetY={r.offsetY}
      totalHeight={r.totalHeight}
      totalItems={r.totalItems}
      scrollRef={r.scrollRef as React.RefObject<HTMLDivElement>}
      hasNext={r.hasNext}
    />
  );
}

export default function App() {
  const [mode, setMode] = useState<Mode>("page");
  return (
    <div className="shell">
      <h1>react-resource-ui</h1>
      <p className="sub">
        Same component, same data source. Change one config value and the
        pagination behavior changes.
      </p>
      <div className="seg">
        {MODES.map((m) => (
          <button key={m} className={m === mode ? "on" : ""} onClick={() => setMode(m)}>
            {m}
          </button>
        ))}
      </div>
      <pre className="code">
{`useResource({
  source: fetchTodos,
  pagination: { type: `}<b>{`"${mode}"`}</b>{`, pageSize: ${PAGE_SIZE} },
  virtualization: { enabled: true, itemHeight: 50, containerHeight: 400 },
})`}
      </pre>
      <Demo key={mode} mode={mode} />
    </div>
  );
}
