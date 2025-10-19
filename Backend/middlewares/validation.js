const validateBloodRequest = (req, res, next) => {
    const { patientName, bloodGroup, unitsNeeded, hospitalName, contactNumber, requiredBy } = req.body;
    
    const errors = [];
    
    if (!patientName || patientName.trim().length < 2) errors.push('Valid patient name required');
    if (!['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(bloodGroup)) errors.push('Invalid blood group');
    if (!unitsNeeded || unitsNeeded < 1) errors.push('Units needed must be at least 1');
    if (!hospitalName || hospitalName.trim().length < 2) errors.push('Valid hospital name required');
    if (!contactNumber || contactNumber.length < 7) errors.push('Valid contact number required');
    if (!requiredBy || new Date(requiredBy) <= new Date()) errors.push('Valid future date required');
  
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
  
  const validateDonorUpdate = (req, res, next) => {
    const { bloodgroup, weight, age } = req.body;
    
    const errors = [];
    
    if (age && (age < 18 || age > 65)) errors.push('Donor age must be between 18 and 65');
    if (weight && (weight < 50)) errors.push('Donor weight must be at least 50kg');
    if (bloodgroup && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(bloodgroup)) {
      errors.push('Invalid blood group');
    }
  
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
  
  module.exports = {
    validateBloodRequest,
    validateDonorUpdate
  };