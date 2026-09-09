function CategoryList({ categories, activeSlug, onSelect }) {
  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      <button
        type="button"
        className={`btn btn-sm ${activeSlug ? "btn-outline-secondary" : "btn-secondary"}`}
        onClick={() => onSelect("")}
      >
        All posts
      </button>

      {categories.map((category) => (
        <button
          key={category._id}
          type="button"
          className={`btn btn-sm ${activeSlug === category.slug ? "btn-secondary" : "btn-outline-secondary"}`}
          onClick={() => onSelect(category.slug)}
        >
          {category.name} ({category.postCount})
        </button>
      ))}
    </div>
  );
}

export default CategoryList;
