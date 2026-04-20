function UtilityRail({
  itemCount,
  isCollapsed,
  activeSceneLabel,
  activeSceneLine,
  chapterProgress,
  sceneCount,
}) {
  return (
    <header className={`utility-rail ${isCollapsed ? "is-collapsed" : ""}`}>
      <div className="utility-rail__meta">
        <p className="utility-rail__brand">Momaz Cinematic Sequence</p>
        <p className="utility-rail__count" role="status">
          {`${itemCount} focal pieces`}
        </p>
      </div>

      <div className="utility-rail__progress" aria-hidden="true">
        <div style={{ width: `${chapterProgress}%` }} />
      </div>
      <p className="utility-rail__chapter" role="status">
        {activeSceneLabel
          ? `${activeSceneLabel} · ${chapterProgress}% of sequence`
          : "Curating sequence"}
      </p>
      <p className="utility-rail__line">
        {activeSceneLine || "Each chapter is composed around a single dominant piece."}
      </p>
      <p className="utility-rail__position" role="status">
        {`${Math.max(1, Math.round((chapterProgress / 100) * Math.max(1, sceneCount)))} of ${Math.max(1, sceneCount)}`}
      </p>
    </header>
  );
}

export default UtilityRail;
