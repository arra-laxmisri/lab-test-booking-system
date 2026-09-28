import React, { useState, useMemo } from 'react';
import { ITest } from '../types/index.js';
import { TestCard } from '../components/TestCard.js';
import { Search, ArrowUpDown, Filter, XCircle } from 'lucide-react';

interface TestsPageProps {
  tests: ITest[];
  initialCategory?: string;
  initialSearch?: string;
  onViewDetails: (test: ITest) => void;
  onBookNow: (test: ITest) => void;
}

export const TestsPage: React.FC<TestsPageProps> = ({
  tests,
  initialCategory = 'All',
  initialSearch = '',
  onViewDetails,
  onBookNow,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');

  const categories = [
    'All',
    'Blood Tests',
    'Diabetes',
    'Thyroid',
    'Liver',
    'Kidney',
    'Vitamins',
    'Hormones',
    'Full Body Checkups',
  ];

  const filteredTests = useMemo(() => {
    return tests
      .filter((t) => {
        const matchesCategory =
          selectedCategory === 'All' || t.category.toLowerCase() === selectedCategory.toLowerCase();

        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        // recommended: popular first
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      });
  }, [tests, selectedCategory, search, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortBy('recommended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Laboratory Diagnostic Catalog
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Explore certified medical tests and wellness checkups with upfront transparent pricing and quick turnaround.
        </p>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by test name or medical category..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-xs font-semibold py-2 px-3 text-slate-800 focus:outline-none focus:border-teal-600 cursor-pointer"
          >
            <option value="recommended">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Tabs (Zero-Pill Interactive Segmented Control) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Active Count & Clear Filter Action */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
        <p>
          Showing <span className="font-bold text-slate-800">{filteredTests.length}</span> diagnostic test
          {filteredTests.length === 1 ? '' : 's'}
          {selectedCategory !== 'All' && <span> in <span className="font-semibold text-slate-800">{selectedCategory}</span></span>}
        </p>

        {(selectedCategory !== 'All' || search) && (
          <button
            onClick={handleResetFilters}
            className="text-teal-700 font-semibold hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Tests Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <TestCard
              key={test._id}
              test={test}
              onViewDetails={onViewDetails}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching laboratory tests</h3>
          <p className="text-xs text-slate-500 mt-1">
            We couldn't find any tests matching "{search}". Try searching with alternate medical terms or view all tests.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Reset Catalog Filters
          </button>
        </div>
      )}
    </div>
  );
};
