import React, { useState } from 'react';
 import { Card, Container, Form, Button } from 'react-bootstrap';
 import './Groups.css';
 
 const Groups = () => {
   const [joinGroupName, setJoinGroupName] = useState('');
   const [createGroupName, setCreateGroupName] = useState('');
 
   const handleJoinGroup = (e) => {
     e.preventDefault();
     // TODO: Implement join group functionality
     console.log('Joining group:', joinGroupName);
   };
 
   const handleCreateGroup = (e) => {
     e.preventDefault();
     // TODO: Implement create group functionality
     console.log('Creating group:', createGroupName);
   };
 
   return (
     <Container fluid className="py-4">
       <div className="d-flex justify-content-between align-items-center mb-4">
         <h1>Groups</h1>
       </div>
 
       <div className="groups-container">
         {/* Join Group Card */}
         <Card className="group-card mb-4">
           <Card.Body>
             <Card.Title className="mb-4">Join an Existing Group</Card.Title>
             <Form onSubmit={handleJoinGroup}>
               <Form.Group className="d-flex gap-3">
                 <Form.Control
                   type="text"
                   placeholder="Group Name"
                   value={joinGroupName}
                   onChange={(e) => setJoinGroupName(e.target.value)}
                   className="flex-grow-1"
                 />
                 <Button 
                   type="submit" 
                   variant="primary"
                   className="join-button"
                 >
                   Join
                 </Button>
               </Form.Group>
             </Form>
           </Card.Body>
         </Card>
 
         {/* Create Group Card */}
         <Card className="group-card">
           <Card.Body>
             <Card.Title className="mb-4">Create a Group</Card.Title>
             <Form onSubmit={handleCreateGroup}>
               <Form.Group className="d-flex gap-3">
                 <Form.Control
                   type="text"
                   placeholder="Group Name"
                   value={createGroupName}
                   onChange={(e) => setCreateGroupName(e.target.value)}
                   className="flex-grow-1"
                 />
                 <Button 
                   type="submit" 
                   variant="primary"
                   className="create-button"
                 >
                   Create
                 </Button>
               </Form.Group>
             </Form>
           </Card.Body>
         </Card>
       </div>
     </Container>
   );
 };
 
 export default Groups; 