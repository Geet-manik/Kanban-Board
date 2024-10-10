import React, { useEffect, useState, useCallback } from 'react';
import styles from './App.module.css';

import List from './components/List/List';
import Navbar from './components/Navbar/Navbar';

function App() {
  const statusList = ['In progress', 'Backlog', 'Todo', 'Done', 'Cancelled'];
  const priorityList = [
    { name: 'No priority', priority: 0 },
    { name: 'Low', priority: 1 },
    { name: 'Medium', priority: 2 },
    { name: 'High', priority: 3 },
    { name: 'Urgent', priority: 4 },
  ];
  const [userList, setuserList] = useState([]);
  const [groupValue, setgroupValue] = useState(getStateFromLocalStorage() || 'status');
  const [orderValue, setorderValue] = useState('title');
  const [ticketDetails, setticketDetails] = useState([]);

  const orderDataByValue = useCallback(
    async (cardsArry) => {
      if (orderValue === 'priority') {
        cardsArry.sort((a, b) => b.priority - a.priority);
      } else if (orderValue === 'title') {
        cardsArry.sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();

          if (titleA < titleB) {
            return -1;
          } else if (titleA > titleB) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      await setticketDetails(cardsArry);
    },
    [orderValue, setticketDetails]
  );

  function saveStateToLocalStorage(state) {
    localStorage.setItem('groupValue', JSON.stringify(state));
  }

  function getStateFromLocalStorage() {
    const storedState = localStorage.getItem('groupValue');
    if (storedState) {
      return JSON.parse(storedState);
    }
    return null;
  }

  useEffect(() => {
    saveStateToLocalStorage(groupValue);

    async function fetchData() {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      const data = await response.json();
      await refactorData(data);
    }

    fetchData();

    async function refactorData(data) {
      let ticketArray = [];
      if (data && data.tickets && data.users) {
        for (let i = 0; i < data.tickets.length; i++) {
          for (let j = 0; j < data.users.length; j++) {
            if (data.tickets[i].userId === data.users[j].id) {
              let ticketJson = { ...data.tickets[i], userObj: data.users[j] };
              ticketArray.push(ticketJson);
            }
          }
        }
        const userName = data.users.map((user) => user.name);

        setuserList(userName);
      }
      await setticketDetails(ticketArray);
      orderDataByValue(ticketArray);
    }
  }, [orderDataByValue, groupValue]);

  function handleGroupValue(value) {
    setgroupValue(value);
    console.log(value);
  }

  function handleOrderValue(value) {
    setorderValue(value);
    console.log(value);
  }

  return (
    <>
      <Navbar
        groupValue={groupValue}
        orderValue={orderValue}
        handleGroupValue={handleGroupValue}
        handleOrderValue={handleOrderValue}
      />
      <section className={styles.boardDetails}>
        <div className={styles.boardDetailsList}>
          {
            {
              status: (
                <>
                  {statusList.map((listItem) => {
                    return (
                      <List
                        key={listItem}
                        groupValue="status"
                        orderValue={orderValue}
                        listTitle={listItem}
                        listIcon=""
                        statusList={statusList}
                        ticketDetails={ticketDetails}
                      />
                    );
                  })}
                </>
              ),
              user: (
                <>
                  {userList.map((listItem) => {
                    return (
                      <List
                        key={listItem}
                        groupValue="user"
                        orderValue={orderValue}
                        listTitle={listItem}
                        listIcon=""
                        userList={userList}
                        ticketDetails={ticketDetails}
                      />
                    );
                  })}
                </>
              ),
              priority: (
                <>
                  {priorityList.map((listItem) => {
                    return (
                      <List
                        key={listItem.priority}
                        groupValue="priority"
                        orderValue={orderValue}
                        listTitle={listItem.priority}
                        listIcon=""
                        priorityList={priorityList}
                        ticketDetails={ticketDetails}
                      />
                    );
                  })}
                </>
              ),
            }[groupValue]
          }
        </div>
      </section>
    </>
  );
}

export default App;