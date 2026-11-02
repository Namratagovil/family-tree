import { Person } from '@/types'

export const FAMILY_MEMBERS: Person[] = [
  // Generation 1 — Root
  { id: '1', name: 'Kunwar Sain', parentId: null, generation: 1 },

  // Generation 2 — only child of Kunwar Sain
  { id: '11', name: 'Baijnath Sahay', parentId: '1', generation: 2 },

  // Generation 3 — sons of Baijnath Sahay
  { id: '111', name: 'Jhumpad Sain', parentId: '11', generation: 3 },
  { id: '112', name: 'Bhola Nath Sahay', parentId: '11', generation: 3 },

  // Generation 4 — children of Jhumpad Sain
  { id: '1111', name: 'Rameshwar Dayal', parentId: '111', generation: 4, spouse: 'Jugli Bai' },
  { id: '1112', name: 'Baleshwar Dayal', parentId: '111', generation: 4, spouse: 'Asha Devi' },
  { id: '1113', name: 'Visheshwar Dayal', parentId: '111', generation: 4 },
  { id: '1114', name: 'Chhuttan Lal', parentId: '111', generation: 4 },
  { id: '1115', name: 'Mrs Darshanvati', parentId: '111', generation: 4 },

  // Generation 4 — children of Bhola Nath Sahay
  { id: '1121', name: 'Gunwant Rai', parentId: '112', generation: 4 },
  { id: '1122', name: 'Vidya Ratan', parentId: '112', generation: 4 },
  { id: '1123', name: 'Raj Kumar', parentId: '112', generation: 4 },
  { id: '1124', name: 'Om Saran', parentId: '112', generation: 4, spouse: 'Vidyavati' },

  // Generation 5 — children of Rameshwar Dayal (1111)
  { id: '11111', name: 'Rajendra Kumar', parentId: '1111', generation: 5, spouse: 'Shanti Devi' },
  { id: '11112', name: 'Mohan Lal', parentId: '1111', generation: 5, spouse: 'Shanti Devi' },
  { id: '11113', name: 'Sohan Lal', parentId: '1111', generation: 5, spouse: 'Sushila Devi' },
  { id: '11114', name: 'Narendra Kumar', parentId: '1111', generation: 5 },
  { id: '11115', name: 'Virandra Kumar', parentId: '1111', generation: 5, spouse: 'Urmila' },
  { id: '11116', name: 'Shakuntala Mittal', parentId: '1111', generation: 5, spouse: 'Ramchand' },
  { id: '11117', name: 'Puran Devi', parentId: '1111', generation: 5, spouse: 'Govind Ram' },
  { id: '11118', name: 'Sushila Devi', parentId: '1111', generation: 5, spouse: 'Dr Moolchand Mittal' },
  { id: '11119', name: 'Mrs Sumitra', parentId: '1111', generation: 5 },

  // Generation 5 — children of Baleshwar Dayal (1112)
  { id: '11121', name: 'Madan Kumar', parentId: '1112', generation: 5, spouse: 'Kamla Devi' },
  { id: '11122', name: 'Shiv Kumar', parentId: '1112', generation: 5 },
  { id: '11123', name: 'Dev Kumar', parentId: '1112', generation: 5 },
  { id: '11124', name: 'Mainavati', parentId: '1112', generation: 5, spouse: 'Dr Ishwar Dayal' },

  // Generation 5 — children of Visheshwar Dayal (1113)
  { id: '11131', name: 'Kailash Chandra', parentId: '1113', generation: 5 },
  { id: '11132', name: 'Hemchandra', parentId: '1113', generation: 5 },
  { id: '11133', name: 'Prahlad', parentId: '1113', generation: 5 },
  { id: '11134', name: 'Santoshvati', parentId: '1113', generation: 5 },

  // Generation 5 — children of Chhuttan Lal (1114)
  { id: '11141', name: 'Brij Kumar', parentId: '1114', generation: 5 },
  { id: '11142', name: 'Suraj Kumar', parentId: '1114', generation: 5, spouse: 'Gyarsi Devi' },

  // Generation 5 — children of Gunwant Rai (1121)
  { id: '11211', name: 'Prem Prakash', parentId: '1121', generation: 5 },
  { id: '11212', name: 'Vishnu Prakash', parentId: '1121', generation: 5 },
  { id: '11213', name: 'Kishan Gopal', parentId: '1121', generation: 5 },

  // Generation 5 — children of Vidya Ratan (1122)
  { id: '11221', name: 'Manohar Lal Singhal', parentId: '1122', generation: 5 },
  { id: '11222', name: 'Urmila', parentId: '1122', generation: 5 },
  { id: '11223', name: 'Chandra Mohan', parentId: '1122', generation: 5 },
  { id: '11224', name: 'Rakesh', parentId: '1122', generation: 5, spouse: 'Navneeta' },
  { id: '11225', name: 'Suresh', parentId: '1122', generation: 5 },
  { id: '11226', name: 'Chitra', parentId: '1122', generation: 5 },
  { id: '11227', name: 'Suman', parentId: '1122', generation: 5 },

  // Generation 5 — children of Raj Kumar (1123)
  { id: '11231', name: 'Mohan', parentId: '1123', generation: 5 },
  { id: '11232', name: 'Binda', parentId: '1123', generation: 5 },
  { id: '11233', name: 'Ramesh', parentId: '1123', generation: 5 },

  // Generation 5 — children of Om Saran (1124)
  { id: '11241', name: 'Gopal Krishan', parentId: '1124', generation: 5 },
  { id: '11242', name: 'Radha Krishan', parentId: '1124', generation: 5, spouse: 'Asha' },
  { id: '11243', name: 'Gopi Chand', parentId: '1124', generation: 5, spouse: 'Manju' },
  { id: '11244', name: 'Ram Naresh', parentId: '1124', generation: 5, spouse: 'Savita' },

  // Generation 6 — children of Rajendra Kumar (11111)
  { id: '111111', name: 'Dr Rakesh Kumar', parentId: '11111', generation: 6 },
  { id: '111112', name: 'Dinesh Kumar', parentId: '11111', generation: 6 },
  { id: '111113', name: 'Shailendra', parentId: '11111', generation: 6 },
  { id: '111114', name: 'Anil Kumar', parentId: '11111', generation: 6 },
  { id: '111115', name: 'Mrs Padma', parentId: '11111', generation: 6 },
  { id: '111116', name: 'Mrs Vipula', parentId: '11111', generation: 6 },

  // Generation 6 — children of Mohan Lal (11112)
  { id: '111121', name: 'Dr Ashok', parentId: '11112', generation: 6 },
  { id: '111122', name: 'Satish', parentId: '11112', generation: 6 },
  { id: '111123', name: 'Raju', parentId: '11112', generation: 6 },

  // Generation 6 — children of Sohan Lal (11113)
  { id: '111131', name: 'Dr Sunil', parentId: '11113', generation: 6 },
  { id: '111132', name: 'Dr Madhu', parentId: '11113', generation: 6 },

  // Generation 6 — children of Virandra Kumar (11115)
  { id: '111151', name: 'Dr Sanjeev', parentId: '11115', generation: 6 },
  { id: '111152', name: 'Dr Sujata Bhargav', parentId: '11115', generation: 6 },
  { id: '111153', name: 'Dr Jyoti Bindal', parentId: '11115', generation: 6 },

  // Generation 6 — children of Madan Kumar (11121)
  { id: '111211', name: 'Dr Dinesh', parentId: '11121', generation: 6, spouse: 'Dr Smita' },
  { id: '111212', name: 'Arun', parentId: '11121', generation: 6 },
  { id: '111213', name: 'Mrs Vinodini', parentId: '11121', generation: 6 },
  { id: '111214', name: 'Mrs Veena Jain', parentId: '11121', generation: 6 },
  { id: '111215', name: 'Mrs Pramodini', parentId: '11121', generation: 6 },

  // Generation 6 — children of Shiv Kumar (11122)
  { id: '111221', name: 'Mahesh Kumar', parentId: '11122', generation: 6 },
  { id: '111222', name: 'Mrs Krishna', parentId: '11122', generation: 6 },
  { id: '111223', name: 'Mrs Dolly', parentId: '11122', generation: 6 },

  // Generation 6 — children of Brij Kumar (11141)
  { id: '111411', name: 'Pradeep Kumar', parentId: '11141', generation: 6 },

  // Generation 6 — children of Suraj Prasad (11142)
  { id: '111421', name: 'Anil Kumar', parentId: '11142', generation: 6 },
  { id: '111422', name: 'Sunil Kumar', parentId: '11142', generation: 6 },

  // Generation 6 — children of Prem Prakash (11211)
  { id: '112111', name: 'Pawan Kumar', parentId: '11211', generation: 6 },
  { id: '112112', name: 'Rajesh', parentId: '11211', generation: 6 },
  { id: '112113', name: 'Deepak', parentId: '11211', generation: 6 },

  // Generation 6 — children of Vishnu Prakash (11212)
  { id: '112121', name: 'Rakesh', parentId: '11212', generation: 6 },
  { id: '112122', name: 'Gree Raj', parentId: '11212', generation: 6 },

  // Generation 6 — children of Kishan Gopal (11213)
  { id: '112131', name: 'Tanuj', parentId: '11213', generation: 6 },
  // Note: source shows ID 12142 for Neeraj; parent overridden to 1213
  { id: '112142', name: 'Neeraj', parentId: '11213', generation: 6 },

  // Generation 6 — children of Manohar Lal Singhal (11221)
  { id: '112211', name: 'Manish Singhal', parentId: '11221', generation: 6 },

  // Generation 6 — children of Rakesh (11224)
  { id: '112241', name: 'Raina', parentId: '11224', generation: 6, spouse: 'Saurabh' },
  { id: '112242', name: 'Nitin', parentId: '11224', generation: 6, spouse: 'Surabhi' },

  // Generation 6 — children of Gopal Krishan (11241)
  { id: '112411', name: 'Dr. Sanjay', parentId: '11241', generation: 6, spouse: 'Savita' },
  { id: '112412', name: 'Shalu', parentId: '11241', generation: 6, spouse: 'Anil' },

  // Generation 6 — children of Radha Krishan (11242)
  { id: '112421', name: 'Sumit', parentId: '11242', generation: 6, spouse: 'Shilpi' },
  { id: '112422', name: 'Ruchir', parentId: '11242', generation: 6, spouse: 'Sonal' },
  { id: '112423', name: 'Namrata', parentId: '11242', generation: 6, spouse: 'Varun' },

  // Generation 6 — children of Gopi Chand (11243)
  { id: '112431', name: 'Priya', parentId: '11243', generation: 6, spouse: 'Mayank' },
  { id: '112432', name: 'Saurabh', parentId: '11243', generation: 6, spouse: 'Jalpa' },

  // Generation 6 — children of Ram Naresh (11244)
  { id: '112441', name: 'Namieta', parentId: '11244', generation: 6, spouse: 'Vijay' },
  { id: '112442', name: 'Amit', parentId: '11244', generation: 6, spouse: 'Richa' },

  // Generation 7 — children of Tanuj (112131)
  { id: '1121311', name: 'Nishita', parentId: '112131', generation: 7 },
  { id: '1121312', name: 'Vasika', parentId: '112131', generation: 7 },

  // Generation 7 — children of Neeraj (112142)
  { id: '1121421', name: 'Vasika', parentId: '112142', generation: 7 },
  { id: '1121422', name: 'Sobhagya', parentId: '112142', generation: 7 },

  // Generation 7 — children of Dr. Sanjay (112411)
  { id: '1124111', name: 'Ayush', parentId: '112411', generation: 7 },
  { id: '1124112', name: 'Satyam', parentId: '112411', generation: 7 },

  // Generation 7 — children of Shalu (112412)
  { id: '1124121', name: 'Shivang', parentId: '112412', generation: 7 },

  // Generation 7 — children of Sumit (112421)
  { id: '1124211', name: 'Agnim', parentId: '112421', generation: 7 },
  { id: '1124212', name: 'Ananya', parentId: '112421', generation: 7 },

  // Generation 7 — children of Ruchir (112422)
  { id: '1124221', name: 'Nandani', parentId: '112422', generation: 7 },
  { id: '1124222', name: 'Avni', parentId: '112422', generation: 7 },

  // Generation 7 — children of Priya (112431)
  { id: '1124311', name: 'Ayati', parentId: '112431', generation: 7 },

  // Generation 7 — children of Saurabh (112432)
  { id: '1124321', name: 'Sheyransh', parentId: '112432', generation: 7 },
  { id: '1124322', name: 'Shreenika', parentId: '112432', generation: 7 },

  // Generation 7 — children of Namieta (112441)
  { id: '1124411', name: 'Ananya', parentId: '112441', generation: 7 },
  { id: '1124412', name: 'Prabir', parentId: '112441', generation: 7 },

  // Generation 7 — children of Amit (112442)
  { id: '1124421', name: 'Krishnav', parentId: '112442', generation: 7 },
  { id: '1124422', name: 'Arjun', parentId: '112442', generation: 7 },
]

export const CONTACT_EMAIL = 'namratagovil@gmail.com'
