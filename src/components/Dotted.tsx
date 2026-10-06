/** A list set with spaced middle dots; Overpass's own spacing around "·" is too tight. */
export function Dotted({ items }: { items: readonly string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={item}>
          {i > 0 ? (
            <>
              {" "}
              <span className="sep" aria-hidden="true" />{" "}
            </>
          ) : null}
          {item}
          {i < items.length - 1 ? <span className="visually-hidden">, </span> : null}
        </span>
      ))}
    </>
  );
}
