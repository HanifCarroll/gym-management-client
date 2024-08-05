import styles from "./page.module.css";

export default function Home() {
  // Mock data - replace with actual data fetching logic
  const totalMembers = 250;
  const activeClasses = 15;
  const monthlyRevenue = 15000;

  const upcomingClasses = [
    { id: 1, name: 'Yoga', time: '10:00 AM', instructor: 'Jane Doe' },
    { id: 2, name: 'Spin', time: '11:30 AM', instructor: 'John Smith' },
    { id: 3, name: 'HIIT', time: '2:00 PM', instructor: 'Mike Johnson' },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Gym Management Dashboard</h1>
      </div>

      <div className={styles.grid}>
        {/* Quick Stats */}
        <div className={styles.card}>
          <h2>Total Members</h2>
          <p>{totalMembers}</p>
        </div>
        <div className={styles.card}>
          <h2>Active Classes</h2>
          <p>{activeClasses}</p>
        </div>
        <div className={styles.card}>
          <h2>Monthly Revenue</h2>
          <p>${monthlyRevenue}</p>
        </div>
        <div className={styles.card}>
          <h2>Quick Actions</h2>
          <p>
            <button>Add Member</button>
            <button>Create Class</button>
          </p>
        </div>

        {/* Upcoming Classes */}
        <div className={`${styles.card} ${styles.largeCard}`}>
          <h2>Upcoming Classes</h2>
          <ul>
            {upcomingClasses.map((cls) => (
              <li key={cls.id}>
                {cls.name} - {cls.time} - {cls.instructor}
              </li>
            ))}
          </ul>
          <button>View All Classes</button>
        </div>

        {/* Recent Activity */}
        <div className={`${styles.card} ${styles.largeCard}`}>
          <h2>Recent Activity</h2>
          <ul>
            <li>New member registration - John Doe - 5 minutes ago</li>
            <li>Class cancelled - Spin Class - 30 minutes ago</li>
            <li>Payment received - Jane Smith - 1 hour ago</li>
          </ul>
          <button>View All Activity</button>
        </div>
      </div>
    </main>
  );
}