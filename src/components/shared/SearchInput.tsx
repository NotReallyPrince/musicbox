'use client'; // Mark as client component for App Router

import { AutoComplete } from 'antd';
import apiService from '@/services/api.service';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setApp } from '@/redux/slices/app.slice';
import { BaseOptionType } from 'rc-select/es/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

export default function SearchInput({ value }: { value?: string }) {
  const { searchHistory } = useAppSelector((state) => state.app);
  const [actualValue, setActualValue] = useState('');
  const [suggestedOptions, setSuggestedOptions] = useState<BaseOptionType[]>([]);
  const [options, setOptions] = useState([]);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (value !== actualValue) setActualValue(value || '');
  }, [value]);

  const doSearch = (value: string) => {
    if (!value.trim()) return;
    let newHistory = [...searchHistory];
    const index = newHistory.findIndex(
      (x) => x.toLowerCase().trim() === value.toLowerCase().trim()
    );
    if (index === -1) {
      newHistory.unshift(value);
    } else {
      newHistory = [value, ...newHistory.filter((x, i) => i !== index)];
    }
    dispatch(setApp({ searchHistory: newHistory }));
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const formatSearchItem = (item: string) => ({
    value: item,
    label: (
      <>
        <FontAwesomeIcon icon={faHistory} />
        <span style={{ paddingLeft: 8 }}>{item}</span>
      </>
    ),
  });

  useEffect(() => {
    if (actualValue && actualValue.trim()) {
      setSuggestedOptions(
        searchHistory
          .filter((x) => x.trim().toLowerCase().includes(actualValue.trim().toLowerCase()))
          .slice(0, 3)
          .map(formatSearchItem)
      );
    } else {
      setSuggestedOptions(searchHistory.slice(0, 3).map(formatSearchItem));
    }
  }, [actualValue, searchHistory]);

  return (
    <AutoComplete
      options={[...suggestedOptions, ...options]}
      value={actualValue}
      placeholder="Search for songs..."
      showSearch
      style={{ flex: 1 }}
      onChange={(value) => setActualValue(value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') doSearch(actualValue);
      }}
      onSearch={(value) => {
        if (!value.trim()) return setOptions([]);
        apiService.searchSuggestion(value).then((response) => {
          if (response) {
            setOptions(
              response.map((r: string) => ({
                value: r,
                label: r,
              }))
            );
          }
        });
      }}
      onSelect={(value) => doSearch(value)}
    />
  );
}