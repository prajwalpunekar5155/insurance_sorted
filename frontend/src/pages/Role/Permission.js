import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";
import NavBar from "../navBar";

const Permission = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState([
    { name: "View Dashboard", granted: false },
    { name: "Manage Appointments", granted: false },
    { name: "Assign Roles", granted: false },
    { name: "Access Reports", granted: false },
    { name: "Modify Settings", granted: false },
  ]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    // Optionally, fetch role-specific permissions from an API here
  };

  const togglePermission = (index) => {
    setPermissions((prev) =>
      prev.map((perm, i) =>
        i === index ? { ...perm, granted: !perm.granted } : perm
      )
    );
  };

  const savePermissions = () => {
    // Save the selected permissions via API or backend logic
    console.log("Permissions saved for role:", selectedRole, permissions);
    alert("Permissions updated successfully!");
  };

  return (
    <div className="main-wrapper">
      <NavBar />

      <div className="page-wrapper" style={{ marginTop: "50px" }}>
        {/* Main Content */}

        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Manage Permissions
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Role
            </Typography>
            <Select
              value={selectedRole}
              onChange={handleRoleChange}
              displayEmpty
              fullWidth
              variant="outlined"
              sx={{ width: 300 }}
            >
              <MenuItem value="" disabled>
                Select a Role
              </MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Technician">Technician</MenuItem>
              <MenuItem value="Sub-Admin">Sub-Admin</MenuItem>
            </Select>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Permission</TableCell>
                  <TableCell align="center">Granted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions.map((perm, index) => (
                  <TableRow key={index}>
                    <TableCell>{perm.name}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={perm.granted}
                        onChange={() => togglePermission(index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={savePermissions}
            disabled={!selectedRole}
          >
            Save Permissions
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Permission;
