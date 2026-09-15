"use client";

import React, { useState, useEffect, useCallback } from 'react';   
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { auth } from '@/app/firebase';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useMediaQuery, MenuItem, FormControl, Select, InputLabel } from '@mui/material';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [authType, setAuthType] = useState(null);
  const [value, setValue] = useState("1");
  const [leaderboardType, setLeaderboardType] = useState('regular');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userPlacement, setUserPlacement] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const isMobile = useMediaQuery('(max-width:600px)');

  const milestones = [
    { name: 'Bronze Member', points: 10, color: '#CD7F32', prize: 'None'},
    { name: 'Silver Member', points: 25, color: '#A8A8A8', prize: 'Top Member Party *Applies to First Semester*' },
    { name: 'Gold Member', points: 40, color: '#E5E4E2', prize: 'Choose BSLC bus' },
    { name: 'Diamond Member', points: 50, color: '#00BFFF', prize: '???' }
  ];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAuthType = async () => {
      if (!user) return;
      const db = getFirestore();
      const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
      if (!userDoc.empty) setAuthType(userDoc.docs[0].data().authType);
    };
    fetchAuthType();
  }, [user]);

  const fetchLeaderboardData = useCallback(async () => {
    if (!user) return;
    const db = getFirestore();
    const allUsersSnapshot = await getDocs(
      query(collection(db, 'activityPoints2027'), orderBy('activityPoints2027', 'desc'))
    );
    const allUsers = allUsersSnapshot.docs.map(doc => ({
      name: doc.data().name,
      activityPoints: doc.data().activityPoints2027,
      email: doc.data().email
    }));
    setLeaderboardData(allUsers);
    const userRank = allUsers.findIndex(u => u.email === user.email) + 1;
    const userData = allUsers.find(u => u.email === user.email);
    if (userData && !allUsers.slice(0, 5).some(u => u.email === user.email))
      setUserPlacement({ ...userData, rank: userRank });
    else setUserPlacement(null);
  }, [user]);

  useEffect(() => {
    if (leaderboardType === 'regular') fetchLeaderboardData();
  }, [leaderboardType, fetchLeaderboardData]);

  useEffect(() => setPage(0), [leaderboardType]);

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!user) return;
      const db = getFirestore();
      const pointsSnapshot = await getDocs(
        query(collection(db, 'activityPoints2027'), where('email', '==', user.email))
      );
      if (!pointsSnapshot.empty) setUserPoints(pointsSnapshot.docs[0].data().activityPoints2027 || 0);
    };
    fetchUserPoints();
  }, [user]);

  const handleChange = (e, v) => setValue(v);
  const getCurrentMilestone = () => {
    const achieved = milestones.filter(m => userPoints >= m.points);
    return achieved[achieved.length - 1] || null;
  };
  const getNextMilestone = () => {
    return milestones.find(m => userPoints < m.points) || milestones[milestones.length - 1];
  };
  const paginatedLeaderboard = leaderboardData.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  return (
    <div className="flex flex-col items-center p-0 rounded-lg pb-0">
      {user ? (
        <div className="flex flex-col items-center w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12 h-5/6 rounded-lg pt-10 mt-5 shadow-2xl border-4 border-red-violet bg-watermelon-red bg-opacity-70">
          <div className="flex justify-center">
            <img src={user.photoURL} className="w-24 h-24 rounded-full border-2 border-dark-chocolate border-opacity-30 shadow-md" />
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-semibold text-gray-200">{user.displayName}</h2>
            <p className="text-gray-300">{user.email}</p>
          </div>
          <div className="w-full mt-6">
            <TabContext value={value}>
              <Box>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant={isMobile ? "scrollable" : "fullWidth"}
                  scrollButtons={isMobile ? "auto" : "false"}
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{
                    '& .MuiTabs-indicator': { backgroundColor: 'white' },
                    '& .MuiTab-root': { color: '#a0aec0', minWidth: 120 },
                    '& .Mui-selected': { color: 'white !important' }
                  }}
                >
                  <Tab label="Activity Points" value="1" />
                  <Tab label="Milestones" value="2" />
                  <Tab label="Contact Info" value="3" />
                </Tabs>
              </Box>
              <Box className="mt-4">
                <TabPanel value="1">
                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel id="leaderboard-type-label" sx={{ color: 'white' }}>Leaderboard Type</InputLabel>
                    <Select
                      labelId="leaderboard-type-label"
                      value={leaderboardType}
                      onChange={(e) => setLeaderboardType(e.target.value)}
                      sx={{
                        color: 'white',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '.MuiSvgIcon-root': { color: 'white' }
                      }}
                      MenuProps={{ PaperProps: { sx: { color: 'black' }}}}
                    >
                      <MenuItem value="regular">Activity Points</MenuItem>
                    </Select>
                  </FormControl>
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <Button
                        variant="contained"
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                        sx={{ backgroundColor: "#882e39", color: "white", minWidth: "40px" }}
                      >
                        {"<"}
                      </Button>
                      <span className="text-white text-sm">
                        Page {page + 1} / {Math.ceil(leaderboardData.length / pageSize)}
                      </span>
                      <Button
                        variant="contained"
                        disabled={(page + 1) * pageSize >= leaderboardData.length}
                        onClick={() => setPage(page + 1)}
                        sx={{ backgroundColor: "#882e39", color: "white", minWidth: "40px" }}
                      >
                        {">"}
                      </Button>
                    </div>
                    {paginatedLeaderboard.map((item, index) => (
                      <div
                        key={index}
                        className={`flex justify-between p-2 ${
                          item.email === user.email ? 'bg-red-400 bg-opacity-30' : 'bg-red-violet'
                        } text-white rounded-lg shadow-lg border border-dark-chocolate border-opacity-25`}
                      >
                        <span><strong>{page * pageSize + index + 1}</strong> - {item.name}</span>
                        <span>{item.activityPoints} pts</span>
                      </div>
                    ))}
                    {userPlacement && (
                      <>
                        <div className="flex justify-center">
                          <span className="text-gray-300">• • •</span>
                        </div>
                        <div className="flex justify-between p-2 bg-red-400 bg-opacity-30 text-white rounded-lg shadow-lg border border-dark-chocolate border-opacity-25">
                          <span><strong>{userPlacement.rank}</strong> - {userPlacement.name}</span>
                          <span>{userPlacement.activityPoints} pts</span>
                        </div>
                      </>
                    )}
                  </div>
                </TabPanel>
                <TabPanel value="2">
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Your Progress
                      </h2>
                      <p className="mb-1 text-lg">
                        You have: <span className="font-bold">{userPoints} </span> points
                      </p>
                      {getNextMilestone() && getCurrentMilestone() !== getNextMilestone() && (
                        <p className="text-gray-300 text-lg">
                          Next milestone: {getNextMilestone().name} at {getNextMilestone().points} points
                        </p>
                      )}
                    </div>
                    <div className="space-y-8">
                      <div className={`relative flex ${isMobile ? "flex-col items-center" : "flex-row justify-between w-full"}`}>
                        {!isMobile && (
                          <>
                            <div className="absolute top-8 left-0 right-0 h-2 bg-gray-700 rounded-full"></div>
                            <div
                              className="absolute top-8 left-0 h-2 bg-yellow-400 rounded-full shadow-lg transition-all duration-1000 ease-out"
                              style={{
                                width: `${Math.min(
                                  (userPoints / milestones[milestones.length - 1].points) * 100,
                                  100
                                )}%`
                              }}
                            ></div>
                          </>
                        )}
                        <div
                          className={`relative z-10 flex ${
                            isMobile
                              ? "flex-col justify-between space-y-6"
                              : "flex-row justify-between w-full"
                          }`}
                        >
                          {milestones.map((milestone, index) => {
                            const isAchieved = userPoints >= milestone.points;
                            const isNext =
                              !isAchieved &&
                              userPoints < milestone.points &&
                              (!milestones[index - 1] || userPoints >= milestones[index - 1].points);
                            return (
                              <div key={milestone.name} className="relative flex flex-col items-center">
                                <div
                                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 ${
                                    isAchieved
                                      ? "border-white shadow-glow"
                                      : isNext
                                      ? "border-yellow-300 shadow-yellow-300/50"
                                      : "border-gray-400"
                                  }`}
                                  style={{
                                    backgroundColor: milestone.color,
                                    boxShadow: isAchieved ? `0 0 20px ${milestone.color}80` : "none"
                                  }}
                                >
                                  {isAchieved ? (
                                    <span className="text-white text-2xl font-bold">✓</span>
                                  ) : (
                                    <span className="text-white text-lg font-bold">{milestone.points}</span>
                                  )}
                                </div>
                                <div className="mt-3 text-center">
                                  <h3
                                    className={`text-sm font-bold ${
                                      isAchieved ? "text-white" : isNext ? "text-yellow-200" : "text-gray-400"
                                    }`}
                                  >
                                    {milestone.name}
                                  </h3>
                                  <p className="text-xs text-gray-400 mt-1">{milestone.points} pts</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {milestones.map((milestone, index) => {
                          const isAchieved = userPoints >= milestone.points;
                          const isNext = !isAchieved && userPoints < milestone.points && 
                            (!milestones[index - 1] || userPoints >= milestones[index - 1].points);
                          return (
                            <div 
                              key={milestone.name}
                              className={`bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20 ${
                                isAchieved ? 'opacity-100' : isNext ? 'opacity-90' : 'opacity-60'
                              }`}
                            >
                              <div className="text-center mb-6">
                                <h4 className={`text-xl font-bold mb-2 ${
                                  isAchieved ? 'text-white' : isNext ? 'text-yellow-200' : 'text-gray-400'
                                }`}>
                                  {milestone.name}
                                </h4>
                                <p className="text-sm text-gray-400 mb-4">
                                  {milestone.points} points
                                </p>
                                <div className="mb-4">
                                  {isAchieved ? (
                                    <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                      ✓ UNLOCKED
                                    </span>
                                  ) : isNext ? (
                                    <span className="inline-block bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                      {milestone.points - userPoints} more points
                                    </span>
                                  ) : (
                                    <span className="inline-block bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                      LOCKED
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-200">
                                  <span className="font-semibold text-white">Prize:</span> {milestone.prize}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="3">
                  <div className="space-y-3">
                    <div className="flex justify-between p-2 bg-red-violet text-white rounded-lg shadow-lg border border-dark-chocolate border-opacity-25">
                      <span><strong>President:</strong> <a href="mailto:sfanse826@gmail.com">sfanse826@gmail.com</a></span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-violet text-white rounded-lg shadow-lg border border-dark-chocolate border-opacity-25">
                      <span><strong>Officers:</strong> <a href="mailto:officers@homesteadfbla.com">officers@homesteadfbla.com</a></span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-violet text-white rounded-lg shadow-lg border border-dark-chocolate border-opacity-25">
                      <span><strong>Competitions:</strong> <a href="mailto:comps@homesteadfbla.com">comps@homesteadfbla.com</a></span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-violet text-white rounded-lg shadow-lg border border-dark-chocolate border-opacity-25">
                      <span><strong>Community Service:</strong> <a href="mailto:cs@homesteadfbla.com">cs@homesteadfbla.com</a></span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-violet text-white rounded-lg shadow-lg border border-dark-chocolate border-opacity-25">
                      <span><strong>Software Ventures:</strong> <a href="mailto:sv@homesteadfbla.com">sv@homesteadfbla.com</a></span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-violet text-white rounded-lg shadow-lg border border-dark-chocolate border-opacity-25">
                      <span><strong>Partnership with Business:</strong> <a href="mailto:pwb@homesteadfbla.com">pwb@homesteadfbla.com</a></span>
                    </div>
                  </div>
                </TabPanel>
              </Box>
            </TabContext>
          </div>
        </div>
      ) : (
        <p className="text-black text-opacity-5 text-lg">...</p>
      )}
    </div>
  );
};

export default ProfileCard;
