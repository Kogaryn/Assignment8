import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Image, Row, Table } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';

export default function App() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    course: '',
    email: '',
    address: '',
  });

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState(1);


  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstname 
      || !formData.lastname 
      || !formData.course 
      || !formData.email 
      || !formData.address) {
      alert("Fill up all the fields first!");
      return;
    }


    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${formData.address}`);
      const data = await response.json();

      // DEFAULT LOCATION IF NOT FOUND (ADDRES)
      let lat = 14.5995;
      let lon = 120.9842; 

      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat);
        lon = parseFloat(data[0].lon);
      } else {
        alert("Using default location");
      }


      const newStudent = {
        id: studentId,
        ...formData,
        coordinates: [lat, lon]
      };

      setStudents([...students, newStudent]);
      setStudentId(studentId + 1);
      setFormData({ firstname: '', lastname: '', course: '', email: '', address: '' });
    } 
    
    catch (error) {
      console.error("Error", error);
      alert("Something wrogn");
    }
  };

  const handleDelete = (idToDelete) => {
    const updatedStudents = students.filter(student => student.id !== idToDelete);
    setStudents(updatedStudents);
  };

  return (
    <div className="min-h-screen bg-slate-200">
      <header className="bg-white shadow-sm">
        <Container fluid className="px-4 py-2 lg:px-8">
          <Row className="align-items-center">
            <Col>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white-600 text-2xl text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-300 hover:scale-120">
                  <Image src="./nuLogo.png" alt="National University logo" />
                </div>
                <div>
                  <h1 className="mb-1 ms-2 text-2xl font-bold text-slate-800 md:text-3xl">National University</h1>
                  <p className="mb-1 ms-2 text-xl text-slate-500">Student Location System</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>

      <main>
        <Container fluid className="px-4 py-6 lg:px-8">
          <Row className="g-4">
            <Col lg={6} className="transition-transform duration-300 hover:scale-101">
              <Card className="overflow-hidden rounded-3xl shadow-lg bg-white">

                <Card.Header className="flex items-center justify-between border-0 bg-white px-6 py-5">
                  <div>
                    <h1 className="mb-1 text-2xl font-bold text-slate-800">Students' Locations</h1>
                    <p className="text-sm text-slate-500">View students' locations through this interactive map</p>
                  </div>
                </Card.Header>

                <Card.Body className="h-[800px] w-full bg-slate-200 p-0 ">
                  <MapContainer center={[14.5995, 120.9842]} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {students.map((student) => (
                      <Marker key={student.id} position={student.coordinates}>
                        <Popup>
                          <div>
                            <b>{student.firstname} {student.lastname}</b><br/>
                            Course: {student.course}<br/>
                            Email: {student.email}
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                  </MapContainer>
                </Card.Body>

              </Card>
            </Col>

            <Col lg={6} className="flex flex-col gap-6">
              <Card className="h-[50%] overflow-hidden rounded-3xl shadow-lg bg-white transition-transform duration-300 hover:scale-101">
                
                <Card.Body className="p-5 pb-4">
                  <div className="mb-4">
                    <h1 className="mb-1 text-2xl font-bold text-slate-800">Student Registration</h1>
                    <p className="text-sm text-slate-500">Enter the student's information and address</p>
                  </div>

                  <Form onSubmit={handleSubmit} className="space-y-2">
                    <Row className="g-4">

                      <Col md={6}>
                        <Form.Group controlId="firstname">
                          <Form.Label className="mb-1 block font-semibold text-slate-700">First Name</Form.Label>
                          <Form.Control name="firstname" value={formData.firstname} onChange={handleInputChange} placeholder="Enter First Name" className="w-full rounded-xl border-slate-200 px-4 py-2.5 shadow-sm" type="text" />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="lastname">
                          <Form.Label className="mb-1 block font-semibold text-slate-700">Last Name</Form.Label>
                          <Form.Control name="lastname" value={formData.lastname} onChange={handleInputChange} placeholder="Enter Last Name" className="w-full rounded-xl border-slate-200 px-4 py-2.5 shadow-sm" type="text" />
                        </Form.Group>
                      </Col>
                      
                    </Row>

                    <Row className="g-4">
                      <Col md={6}>
                        <Form.Group controlId="course">
                          <Form.Label className="mb-1 block font-semibold text-slate-700">Course</Form.Label>
                          <Form.Select name="course" value={formData.course} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                            <option value="">Select Course</option>
                            <option value="BSIT">BSIT</option>
                            <option value="BSPsy">BSPsy</option>
                            <option value="BSMT">BSMT</option>
                            <option value="BSA">BSE</option>
                            <option value="DMD">DMD</option>
                            <option value="BSN">BSN</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="email">
                          <Form.Label className="mb-1 block font-semibold text-slate-700">Email</Form.Label>
                          <Form.Control name="email" value={formData.email} onChange={handleInputChange} placeholder="name@students.nu-moa.edu.ph" className="w-full rounded-xl border-slate-200 px-4 py-2.5 shadow-sm" type="email" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="address" className="mb-1">
                      <Form.Label className="mb-1 block font-semibold text-slate-700">Address</Form.Label>
                      <Form.Control name="address" value={formData.address} onChange={handleInputChange} placeholder="Ex.: Bacoor City, Cavite" className="w-full rounded-xl border-slate-200 px-4 py-2.5 shadow-sm" type="text" />
                    </Form.Group>

                    <Button type="submit" className="mt-3 w-full rounded-xl bg-green-500 py-2 font-semibold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-green-800 transition-transform duration-200 hover:scale-99">
                      Register Student
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

              <Card className="h-[50%] overflow-hidden rounded-3xl shadow-lg bg-white transition-transform duration-300 hover:scale-101">
                <Card.Body className="p-5">

                  <div className="mb-5">
                    <h1 className="mb-1 text-2xl font-bold text-slate-800">Student Records</h1>
                    <p className="mb-0 text-sm text-slate-500">All registered students</p>
                  </div>

                  {students.length === 0 ? (
                    <div className="rounded-2xl py-25 text-center">
                      <h1 className="font-bold text-slate-700">No Student Records</h1>
                      <p className="text-sm text-slate-500">Register a student to display records!</p>
                    </div>
                  ) : (
                    <Table responsive className="w-full text-left">

                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="p-1 font-semibold text-center">Name</th>
                          <th className="p-1 font-semibold text-center">Course</th>
                          <th className="p-1 font-semibold text-center">Email</th>
                          <th className="p-1 font-semibold text-center">Address</th>
                          <th className="p-1 font-semibold text-center">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-2 text-slate-800">{student.lastname}, {student.firstname}</td>
                            <td className="p-2 text-slate-600 text-center">{student.course}</td>
                            <td className="p-2 text-slate-600 text-center">{student.email}</td>
                            <td className="p-2 text-slate-600 text-center">{student.address}</td>
                            <td className="p-2 text-center">
                              <Button onClick={() => handleDelete(student.id)} className="rounded-lg border-0 bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-800 transition-transform duration-200 hover:scale-95">
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </Table>
                  )}
                </Card.Body>
              </Card>

            </Col>

          </Row>
        </Container>
      </main>
    </div>
  );
}