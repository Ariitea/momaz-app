import { getCategoryLabel } from "../utils/copy";

function UtilityRail({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
  sortBy,
  onSortByChange,
  itemCount,
  isCollapsed,
  activeSceneLabel,
  chapterProgress,
}) {
  return (
    <header className={`utility-rail ${isCollapsed ? "is-collapsed" : ""}`}>
      <div className="utility-rail__meta">
        <p className="utility-rail__brand">Momaz Editorial Catalog</p>
        <p className="utility-rail__count" role="status">
          {`${itemCount} pieces in this stream`}
        </p>
      </div>

      <div className="utility-rail__progress" aria-hidden="true">
        <div style={{ width: `${chapterProgress}%` }} />
      </div>
      <p className="utility-rail__chapter" role="status">
        {activeSceneLabel ? `${activeSceneLabel} · ${chapterProgress}%` : "Curating stream"}
      </p>

      <div className="utility-rail__controls">
        <label>
          Search
          <input
            type="search"
            value={query}
            placeholder="Search by title, ID, category"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>

        <label>
          Collection
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All collections" : getCategoryLabel(item)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort
          <select value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
            <option value="recent">Most recent</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
        </label>
      </div>
    </header>
  );
}

export default UtilityRail;
