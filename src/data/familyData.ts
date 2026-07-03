import { Person } from '@/types'

export const FAMILY_MEMBERS: Person[] = [
  // Generation 1 — Root
  { id: '1', name: 'Kunwar Sain', parentId: null, generation: 1 },

  // Generation 2
  { id: '11', name: 'Jupad Sain', parentId: '1', generation: 2 },
  { id: '12', name: 'Bhola Nath', parentId: '1', generation: 2 },

  // Generation 3 — children of Jupad Sain
  { id: '111', name: 'Chuttan Lal', parentId: '11', generation: 3 },
  { id: '112', name: 'B. Dayal', parentId: '11', generation: 3 },
  { id: '113', name: 'R. Dayal', parentId: '11', generation: 3 },
  { id: '114', name: 'B. Dayal (2)', parentId: '11', generation: 3 },

  // Generation 3 — children of Bhola Nath
  { id: '121', name: 'Gunwant Rai', parentId: '12', generation: 3 },
  { id: '122', name: 'V Ratan', parentId: '12', generation: 3 },
  { id: '123', name: 'R Kumar', parentId: '12', generation: 3 },
  { id: '124', name: 'Om Saran', parentId: '12', generation: 3, spouse: 'Vidyavati' },

  // Generation 4 — children of Chuttan Lal (111)
  { id: '1111', name: 'Brij Kumar', parentId: '111', generation: 4 },
  { id: '1112', name: 'Suraj Prasad', parentId: '111', generation: 4 },

  // Generation 4 — children of B. Dayal (112)
  { id: '1121', name: 'Kailash', parentId: '112', generation: 4 },
  { id: '1122', name: 'Hemchand', parentId: '112', generation: 4 },
  { id: '1123', name: 'Praladh', parentId: '112', generation: 4 },
  { id: '1124', name: 'Santosh Vati', parentId: '112', generation: 4 },

  // Generation 4 — children of R. Dayal (113)
  { id: '1131', name: 'Sohan Lal', parentId: '113', generation: 4 },
  { id: '1132', name: 'Mohan Lal', parentId: '113', generation: 4 },
  { id: '1133', name: 'Rajendra Kumar', parentId: '113', generation: 4 },
  { id: '1134', name: 'Virandra Kumar', parentId: '113', generation: 4 },
  { id: '1135', name: 'Mrs Sumitra', parentId: '113', generation: 4 },

  // Generation 4 — children of B. Dayal (114)
  { id: '1141', name: 'Madan Kumar', parentId: '114', generation: 4 },
  { id: '1142', name: 'Shiv Kumar', parentId: '114', generation: 4 },
  { id: '1143', name: 'Dev Kumar', parentId: '114', generation: 4 },
  { id: '1144', name: 'Naina Vati', parentId: '114', generation: 4 },

  // Generation 4 — children of Gunwant Rai (121)
  { id: '1211', name: 'Prem Prakash', parentId: '121', generation: 4 },
  { id: '1212', name: 'Vishnu Prakash', parentId: '121', generation: 4 },
  { id: '1213', name: 'Kishan Gopal', parentId: '121', generation: 4 },

  // Generation 4 — children of V Ratan (122)
  { id: '1221', name: 'Vishnu', parentId: '122', generation: 4 },
  { id: '1222', name: 'Chandra Mohan', parentId: '122', generation: 4 },
  { id: '1223', name: 'Rakesh', parentId: '122', generation: 4 },
  { id: '1224', name: 'Suresh', parentId: '122', generation: 4 },
  { id: '1225', name: 'Chitra', parentId: '122', generation: 4 },
  { id: '1226', name: 'Suman', parentId: '122', generation: 4 },

  // Generation 4 — children of R Kumar (123)
  { id: '1231', name: 'Mohan', parentId: '123', generation: 4 },
  { id: '1232', name: 'Binda', parentId: '123', generation: 4 },
  { id: '1233', name: 'Ramesh', parentId: '123', generation: 4 },

  // Generation 4 — children of Om Saran (124)
  { id: '1241', name: 'Gopal Krishan', parentId: '124', generation: 4 },
  { id: '1242', name: 'Radha Krishan', parentId: '124', generation: 4, spouse: 'Asha' },
  { id: '1243', name: 'Gopi Chand', parentId: '124', generation: 4, spouse: 'Manju' },
  { id: '1244', name: 'Ram Naresh', parentId: '124', generation: 4, spouse: 'Savita' },

  // Generation 5 — children of Brij Kumar (1111)
  { id: '11111', name: 'Pradeep Kumar', parentId: '1111', generation: 5 },

  // Generation 5 — children of Suraj Prasad (1112)
  { id: '11121', name: 'Anil Kumar', parentId: '1112', generation: 5 },
  { id: '11122', name: 'Sunil Kumar', parentId: '1112', generation: 5 },

  // Generation 5 — children of Sohan Lal (1131)
  { id: '11311', name: 'Sunil Kumar', parentId: '1131', generation: 5 },

  // Generation 5 — children of Mohan Lal (1132)
  { id: '11321', name: 'Ashok Kumar', parentId: '1132', generation: 5 },
  { id: '11322', name: 'Sailesh', parentId: '1132', generation: 5 },
  { id: '11323', name: 'Raju', parentId: '1132', generation: 5 },

  // Generation 5 — children of Rajendra Kumar (1133)
  { id: '11331', name: 'Dr Rakesh', parentId: '1133', generation: 5 },
  { id: '11332', name: 'Dinesh', parentId: '1133', generation: 5 },
  { id: '11333', name: 'Shailendra', parentId: '1133', generation: 5 },
  { id: '11334', name: 'Anil Kumar', parentId: '1133', generation: 5 },

  // Generation 5 — children of Virandra Kumar (1134)
  { id: '11341', name: 'Dr Sanjeev', parentId: '1134', generation: 5 },
  { id: '11342', name: 'Dr Sujata', parentId: '1134', generation: 5 },
  { id: '11343', name: 'Dr Jyoti', parentId: '1134', generation: 5 },

  // Generation 5 — children of Madan Kumar (1141)
  { id: '11411', name: 'Dr Dinesh', parentId: '1141', generation: 5 },
  { id: '11412', name: 'Arun Kumar', parentId: '1141', generation: 5 },
  { id: '11413', name: 'Mrs Vinu', parentId: '1141', generation: 5 },
  { id: '11414', name: 'Mrs Vina', parentId: '1141', generation: 5 },
  { id: '11415', name: 'Mrs Padmac', parentId: '1141', generation: 5 },

  // Generation 5 — children of Shiv Kumar (1142)
  { id: '11421', name: 'Mahesh Kumar', parentId: '1142', generation: 5 },
  { id: '11422', name: 'Mrs Krishna', parentId: '1142', generation: 5 },
  { id: '11423', name: 'Mrs Dolly', parentId: '1142', generation: 5 },

  // Generation 5 — children of Prem Prakash (1211)
  { id: '12111', name: 'Pawan Kumar', parentId: '1211', generation: 5 },
  { id: '12112', name: 'Rajesh', parentId: '1211', generation: 5 },
  { id: '12113', name: 'Deepak', parentId: '1211', generation: 5 },

  // Generation 5 — children of Vishnu Prakash (1212)
  { id: '12121', name: 'Rakesh', parentId: '1212', generation: 5 },
  { id: '12122', name: 'Gree Raj', parentId: '1212', generation: 5 },

  // Generation 5 — children of Kishan Gopal (1213)
  { id: '12131', name: 'Tanuj', parentId: '1213', generation: 5 },
  // Note: source shows ID 12142 for Neeraj; parent overridden to 1213
  { id: '12142', name: 'Neeraj', parentId: '1213', generation: 5 },

  // Generation 5 — children of Gopal Krishan (1241)
  { id: '12411', name: 'Dr. Sanjay', parentId: '1241', generation: 5, spouse: 'Savita' },
  { id: '12412', name: 'Shalu', parentId: '1242', generation: 5, spouse: 'Anil' },

  // Generation 5 — children of Radha Krishan (1242)
  { id: '12421', name: 'Sumit', parentId: '1242', generation: 5, spouse: 'Shilpi' },
  { id: '12422', name: 'Ruchir', parentId: '1242', generation: 5, spouse: 'Sonal' },
  { id: '12423', name: 'Namrata', parentId: '1242', generation: 5, spouse: 'Varun' },

  // Generation 5 — children of Gopi Chand (1243)
  { id: '12431', name: 'Priya', parentId: '1243', generation: 5, spouse: 'Mayank' },
  { id: '12432', name: 'Saurabh', parentId: '1243', generation: 5, spouse: 'Jalpa' },

  // Generation 5 — children of Ram Naresh (1244)
  { id: '12441', name: 'Namieta', parentId: '1244', generation: 5, spouse: 'Vijay' },
  { id: '12442', name: 'Amit', parentId: '1244', generation: 5, spouse: 'Richa' },

  // Generation 6 — children of Tanuj (12131)
  { id: '121311', name: 'Nishita', parentId: '12131', generation: 6 },
  { id: '121312', name: 'Vasika', parentId: '12131', generation: 6 },

  // Generation 6 — children of Neeraj (12142)
  { id: '121421', name: 'Vasika', parentId: '12142', generation: 6 },
  { id: '121422', name: 'Sobhagya', parentId: '12142', generation: 6 },

  // Generation 6 — children of Dr. Sanjay (12411)
  { id: '124111', name: 'Ayush', parentId: '12411', generation: 6 },
  { id: '124112', name: 'Satyam', parentId: '12411', generation: 6 },

  // Generation 6 — children of Shalu (12412)
  { id: '124121', name: 'Shivang', parentId: '12412', generation: 6 },

  // Generation 6 — children of Sumit (12421)
  { id: '124211', name: 'Agnim', parentId: '12421', generation: 6 },
  { id: '124212', name: 'Ananya', parentId: '12421', generation: 6 },

  // Generation 6 — children of Ruchir (12422)
  { id: '124221', name: 'Nandani', parentId: '12422', generation: 6 },
  { id: '124222', name: 'Avni', parentId: '12422', generation: 6 },

  // Generation 6 — children of Priya (12431)
  { id: '124311', name: 'Ayati', parentId: '12431', generation: 6 },

  // Generation 6 — children of Saurabh (12432)
  { id: '124321', name: 'Unknown', parentId: '12432', generation: 6 },
  { id: '124322', name: 'Unknown', parentId: '12432', generation: 6 },

  // Generation 6 — children of Namieta (12441)
  { id: '124411', name: 'Ananya', parentId: '12441', generation: 6 },
  { id: '124412', name: 'Prabir', parentId: '12441', generation: 6 },

  // Generation 6 — children of Amit (12442)
  { id: '124421', name: 'Krishnav', parentId: '12442', generation: 6 },
  { id: '124422', name: 'Arjun', parentId: '12442', generation: 6 },
]

export const CONTACT_EMAIL = 'namratagovil@gmail.com'
