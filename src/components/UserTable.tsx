import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from '../stores/UserStore';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import './UserTable.css';

const UserTable: React.FC = observer(() => {
  const { users, loadUsers, hasMore, extraFields } = userStore;

  useEffect(() => {
    if (users.length === 0) loadUsers();
  }, [loadUsers, users.length]);

  const staticFields = ['name', 'surname', 'car', 'age', 'experience'];
  const allHeaders = [...staticFields, ...extraFields.map((f) => f.name)];
  const columnsTemplate = `repeat(${allHeaders.length}, 1fr)`;

  const itemCount = hasMore ? users.length + 1 : users.length;
  const isItemLoaded = (index: number) => index < users.length;
  const loadMoreItems = () => (hasMore ? userStore.loadUsers() : Promise.resolve());

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (!isItemLoaded(index)) {
      return (
        <div
          style={{ ...style, display: 'grid', gridTemplateColumns: columnsTemplate }}
          className="table-row loading"
        >
          <div className="table-cell" style={{ gridColumn: `1 / -1` }}>
            Загрузка...
          </div>
        </div>
      );
    }

    const user = users[index];
    return (
      <div
        style={{ ...style, display: 'grid', gridTemplateColumns: columnsTemplate }}
        className="table-row"
      >
        {allHeaders.map((key) => (
          <div key={key} className="table-cell">
            {user[key] ?? '-'}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="user-table">
      <div className="table-header" style={{ gridTemplateColumns: columnsTemplate }}>
        {allHeaders.map((key) => (
          <div key={key} className="table-cell">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
        ))}
      </div>

      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            height={500}
            itemCount={itemCount}
            itemSize={50}
            width="100%"
            onItemsRendered={onItemsRendered}
            ref={ref}
          >
            {Row}
          </List>
        )}
      </InfiniteLoader>
    </div>
  );
});

export default UserTable;
