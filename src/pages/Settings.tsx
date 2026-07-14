import React, { useEffect, useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  MoonIcon,
  NewspaperIcon,
  PhotoIcon,
  SparklesIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import {
  Preferences,
  SentimentFilter,
  SortOrder,
  ViewMode,
  applyTheme,
  getPreferences,
  savePreferences,
} from '../utils/preferences';

const Settings: React.FC = () => {
  const [preferences, setPreferences] = useState<Preferences>(() => getPreferences());

  useEffect(() => {
    savePreferences(preferences);
    applyTheme(preferences.theme);
    window.dispatchEvent(new Event('newsNowPreferencesChanged'));
  }, [preferences]);

  const update = (patch: Partial<Preferences>) => {
    setPreferences((current) => ({ ...current, ...patch }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="signal-kicker mb-2">
          Preferences
        </p>
        <h1 className="text-3xl font-black text-[var(--text)]">
          Settings
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SettingsPanel
          icon={MoonIcon}
          title="Theme"
          control={
            <Segmented
              value={preferences.theme}
              options={[
                ['signal', 'Signal'],
                ['dark', 'Midnight'],
                ['light', 'Light'],
                ['system', 'System'],
              ]}
              onChange={(theme) => update({ theme: theme as Preferences['theme'] })}
            />
          }
        />

        <SettingsPanel
          icon={Squares2X2Icon}
          title="Default View"
          control={
            <Segmented
              value={preferences.view}
              options={[
                ['grid', 'Grid'],
                ['compact', 'Compact'],
                ['spotlight', 'Spotlight'],
              ]}
              onChange={(view) => update({ view: view as ViewMode })}
            />
          }
        />

        <SettingsPanel
          icon={AdjustmentsHorizontalIcon}
          title="Default Sentiment"
          control={
            <select
              value={preferences.sentiment}
              onChange={(e) => update({ sentiment: e.target.value as SentimentFilter })}
              className="signal-focus w-full rounded-md border border-[var(--line)] bg-[var(--app-bg)] px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-100"
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          }
        />

        <SettingsPanel
          icon={NewspaperIcon}
          title="Default Sort"
          control={
            <Segmented
              value={preferences.sort}
              options={[
                ['desc', 'Newest'],
                ['asc', 'Oldest'],
              ]}
              onChange={(sort) => update({ sort: sort as SortOrder })}
            />
          }
        />

        <SettingsPanel
          icon={PhotoIcon}
          title="Show Images"
          control={
            <Toggle
              checked={preferences.showImages}
              onChange={() => update({ showImages: !preferences.showImages })}
            />
          }
        />

        <SettingsPanel
          icon={SparklesIcon}
          title="Entity Highlights"
          control={
            <Toggle
              checked={preferences.highlightEntities}
              onChange={() =>
                update({ highlightEntities: !preferences.highlightEntities })
              }
            />
          }
        />

        <SettingsPanel
          icon={AdjustmentsHorizontalIcon}
          title="Density"
          control={
            <Segmented
              value={preferences.density}
              options={[
                ['comfortable', 'Comfort'],
                ['compact', 'Dense'],
              ]}
              onChange={(density) =>
                update({ density: density as Preferences['density'] })
              }
            />
          }
        />
      </div>
    </div>
  );
};

function SettingsPanel({
  icon: Icon,
  title,
  control,
}: {
  icon: React.ElementType;
  title: string;
  control: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent)]/10 text-[var(--accent)]">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="font-bold text-[var(--text)]">{title}</h2>
      </div>
      <div className="w-full min-w-0 sm:w-auto sm:min-w-[220px]">{control}</div>
    </section>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex rounded-md border border-[var(--line)] bg-[var(--app-bg)] p-1">
      {options.map(([optionValue, label]) => (
        <button
          key={optionValue}
          onClick={() => onChange(optionValue)}
          className={`flex-1 rounded px-3 py-2 text-xs font-bold transition ${
            value === optionValue
              ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`ml-auto flex h-8 w-14 items-center rounded-full p-1 transition ${
        checked ? 'bg-[var(--accent)]' : 'bg-slate-300 dark:bg-slate-700'
      }`}
      aria-pressed={checked}
    >
      <span
        className={`h-6 w-6 rounded-full bg-white shadow transition ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default Settings;
