import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddAppointment from "./pages/Appointment/AddAppointment";
import Appointment from "./pages/Appointment/Appointment";
import SubadminAppointment from "./pages/SubAdminMaster/SubAdminAppointment";
import LaboratoryAppointment from "./pages/Laboratory/LaboratoryAppointment";
import AppointmentReply from "./pages/Appointment/AppointmentReply";
import AssignedAppointment from "./pages/Appointment/AssignedAppointment";
import EditAppointment from "./pages/Appointment/EditAppointment";
import TodayAppointment from "./pages/Appointment/TodayAppointment";
import AssignAppointmentToTechnician from "./pages/AssignAppointmentToSubAdmin/AssignAppontmentBySubAdmin";
import SelectAppointment from "./pages/AssignAppointmentToSubAdmin/SelectAppointmentBySubAdmin";
import AssignAppointmentByAdmin from "./pages/Appointment/AssignAppointmentByAdmin";
import SelectAppointmentByAdmin from "./pages/Appointment/SelectAppointmentByAdmin";
import AddAssistant from "./pages/Assistant/AddAssistant";
import AssignedAppointmentAssistant from "./pages/Assistant/AssignAppointmentAssistant";
import Assistant from "./pages/Assistant/Assistant";
import EditAssistant from "./pages/Assistant/EditAssistant";
import SelectAppointmentAssistant from "./pages/Assistant/SelectAppointment";
import FullPageCalendar from "./pages/Calander";
import EventDetailsPage from "./pages/EvenetsDetailsPage";
import Home from "./pages/Home";
import AddLaboratory from "./pages/Laboratory/Addlaboratory";
import AdminLaboratory from "./pages/Laboratory/AdminLaboratory";
import EditLaboratory from "./pages/Laboratory/EditLaboratory";
import Laboratory from "./pages/Laboratory/Laboratory";
import SubAdminLaboratory from "./pages/Laboratory/SubAdminLaboratory";
import LaboratoryDashboard from "./pages/LaboratoryDashboard/LaboratoryDashboard";
import Login from "./pages/Login_auth";
import EditProfile from "./pages/Profile/EditProfile";
import Profile from "./pages/Profile/Profile";
import AppointmentReport from "./pages/Reports/AppointmentReport";
import SubadminReport from "./pages/Reports/SubadminReport";
import DiagnosticReport from "./pages/Reports/DiagnosticReport";
import AddRole from "./pages/Role/AddRole";
import EditRole from "./pages/Role/EditRole";
import Permission from "./pages/Role/Permission";
import Role from "./pages/Role/Role";
import AddSubadmin from "./pages/SubAdminMaster/AddSubAdmin";
import AssignedAppointmentCentre from "./pages/SubAdminMaster/AssignAppointmentToCentre";
import Editsubadmin from "./pages/SubAdminMaster/EditSubAdmin";
import SubAdmin from "./pages/SubAdminMaster/SubAdmin";
import SubAdminDashboard from "./pages/SubAdminMaster/SubAdmindashboard";
// import SelectAppointmentCentre from "./pages/SubAdminMaster/SelectAppointmentToCentrer";
import UploadReport from "./pages/Laboratory/UploadReport";
import Rejectedappointment from "./pages/DashboardPages/RejectedAppointemnt";
import RejectedSubadminappointment from "./pages/SubAdminMaster/RejectedSubadminAppointment";
import RejectedLaboratoryappointment from "./pages/Laboratory/RejectedLaboratoryAppointemnt";
import DataMissingappointment from "./pages/DashboardPages/DataMissingAppointemnt";
import SubadminAssignedAppointment from "./pages/SubAdminMaster/AssignedSubadminAppointment";
import LaboratoryAssignedAppointment from "./pages/Laboratory/AssignedLaboratoryAppointment";
import TodaySubadminAppointment from "./pages/SubAdminMaster/TodaySubadminAppointment";
import TodayLaboratoryAppointment from "./pages/Laboratory/TodayLaboratoryAppointment";
import SubadminDataMissingappointment from "./pages/SubAdminMaster/DataMissingSubadmin";
import LaboratoryDataMissingappointment from "./pages/Laboratory/DataMissingLaboratoryAppointment";
import Remark from "./pages/Remark/Remark";
import AddRemark from "./pages/Remark/AddRemark";
import EditRemark from "./pages/Remark/EditRemark";
import AdminLogMaster from "./pages/LogMaster/AdminLogMaster";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Dashboard" element={<Home />}></Route>
        <Route
          path="/LaboratoryDashboard"
          element={<LaboratoryDashboard />}
        ></Route>
        <Route
          path="/SubadminDashboard"
          element={<SubAdminDashboard />}
        ></Route>
        <Route path="/LaboratoryNavbar" element={<laboratoryNavbar />}></Route>
        <Route path="/Appointment" element={<Appointment />}></Route>
        <Route
          path="/RejectedAppointment"
          element={<Rejectedappointment />}
        ></Route>
        <Route
          path="/RejectedSubadminAppointment"
          element={<RejectedSubadminappointment />}
        ></Route>
        <Route
          path="/RejectedLaboratoryAppointment"
          element={<RejectedLaboratoryappointment />}
        ></Route>
        <Route
          path="/DataMissingAppointment"
          element={<DataMissingappointment />}
        ></Route>

        <Route
          path="/SubadminDataMissingAppointment"
          element={<SubadminDataMissingappointment />}
        ></Route>
        <Route
          path="/LaboratoryDataMissingAppointment"
          element={<LaboratoryDataMissingappointment />}
        ></Route>
        <Route
          path="/SubadminAppointment"
          element={<SubadminAppointment />}
        ></Route>
        <Route
          path="/LaboratoryAppointment"
          element={<LaboratoryAppointment />}
        ></Route>
        <Route path="/TodayAppointment" element={<TodayAppointment />}></Route>
        <Route path="/addAppointment" element={<AddAppointment />}></Route>
        <Route path="/edit-appointment/:id" element={<EditAppointment />} />
        <Route path="/ReplyAppointment" element={<AppointmentReply />}></Route>
        <Route path="/calendar" element={<FullPageCalendar />} />
        <Route path="/events/:date" element={<EventDetailsPage />} />
        <Route path="/laboratory" element={<Laboratory />}></Route>
        <Route
          path="/Subadminlaboratory"
          element={<SubAdminLaboratory />}
        ></Route>
        <Route path="/Adminlaboratory" element={<AdminLaboratory />}></Route>
        <Route path="/addLaboratory" element={<AddLaboratory />}></Route>
        <Route path="/edit-laboratory/:id" element={<EditLaboratory />} />
        <Route path="/subadmin" element={<SubAdmin />}></Route>
        <Route path="/addSubadmin" element={<AddSubadmin />}></Route>
        <Route path="/edit-subadmin/:id" element={<Editsubadmin />} />
        <Route path="/assistant" element={<Assistant />}></Route>
        <Route path="/addassistant" element={<AddAssistant />}></Route>
        <Route path="/edit-assistant/:id" element={<EditAssistant />} />
        <Route
          path="/assignedappointments/:status"
          element={<AssignedAppointment />}
        />

        <Route path="/Role" element={<Role />}></Route>
        <Route path="/addRole" element={<AddRole />}></Route>
        <Route path="/edit-role/:id" element={<EditRole />} />
        <Route path="/Permission" element={<Permission />}></Route>
        <Route path="/Profile" element={<Profile />}></Route>
        <Route path="/edit-profile" element={<EditProfile />}></Route>
        <Route
          path="/appointmentreport"
          element={<AppointmentReport />}
        ></Route>
        <Route path="/diagnosticreport" element={<DiagnosticReport />}></Route>
        <Route path="/subadminreport" element={<SubadminReport />}></Route>
        <Route
          path="/AssignAppointmentToTechnician"
          element={<AssignAppointmentToTechnician />}
        ></Route>
        <Route
          path="/selectappointment/:id"
          element={<SelectAppointment />}
        ></Route>
        <Route
          path="/AssignAppointmentToAssistant"
          element={<AssignedAppointmentAssistant />}
        ></Route>
        <Route
          path="/selectappointmentAssistant/:id"
          element={<SelectAppointmentAssistant />}
        ></Route>
        <Route
          path="/AssignAppointmentToCentre"
          element={<AssignedAppointmentCentre />}
        ></Route>
        <Route
          path="/selectappointmentCentre/:id"
          element={<SelectAppointmentAssistant />}
        ></Route>
        <Route
          path="/AssignAppointmentToAdmin"
          element={<AssignAppointmentByAdmin />}
        ></Route>
        <Route
          path="/selectappointmentAdmin/:id"
          element={<SelectAppointmentByAdmin />}
        ></Route>
        <Route path="/UploadReport" element={<UploadReport />}></Route>
        <Route
          path="/assignedsubadminappointments/:status"
          element={<SubadminAssignedAppointment />}
        />
        <Route
          path="/assignedlaboratoryappointments/:status"
          element={<LaboratoryAssignedAppointment />}
        />
        <Route
          path="/getsubadmintodayappointment"
          element={<TodaySubadminAppointment />}
        />
        <Route
          path="/getlaboratorytodayappointment"
          element={<TodayLaboratoryAppointment />}
        />

        <Route path="/remark" element={<Remark />}></Route>
        <Route path="/addremark" element={<AddRemark />}></Route>
        <Route path="/edit-remark/:id" element={<EditRemark />}></Route>
        <Route
          path="/appointmentlogmaster/:id"
          element={<AdminLogMaster />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
