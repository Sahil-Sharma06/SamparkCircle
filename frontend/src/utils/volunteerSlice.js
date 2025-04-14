// src/redux/slices/volunteerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import VolunteerAPI from '../../services/volunteerAPI';

// Async thunks for opportunities
export const fetchOpportunities = createAsyncThunk(
  'volunteer/fetchOpportunities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await VolunteerAPI.getOpportunities();
      return response.data.opportunities;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch opportunities');
    }
  }
);

export const fetchOpportunityById = createAsyncThunk(
  'volunteer/fetchOpportunityById',
  async (opportunityId, { rejectWithValue }) => {
    try {
      const response = await VolunteerAPI.getOpportunity(opportunityId);
      return response.data.opportunity;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch opportunity');
    }
  }
);

export const createOpportunity = createAsyncThunk(
  'volunteer/createOpportunity',
  async (opportunityData, { rejectWithValue }) => {
    try {
      const response = await VolunteerAPI.createOpportunity(opportunityData);
      return response.data.opportunity;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create opportunity');
    }
  }
);

export const updateOpportunity = createAsyncThunk(
  'volunteer/updateOpportunity',
  async ({ opportunityId, data }, { rejectWithValue }) => {
    try {
      const response = await VolunteerAPI.updateOpportunity(opportunityId, data);
      return response.data.opportunity;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update opportunity');
    }
  }
);

export const deleteOpportunity = createAsyncThunk(
  'volunteer/deleteOpportunity',
  async (opportunityId, { rejectWithValue }) => {
    try {
      await VolunteerAPI.deleteOpportunity(opportunityId);
      return opportunityId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete opportunity');
    }
  }
);

// Async thunks for applications
export const applyForOpportunity = createAsyncThunk(
  'volunteer/applyForOpportunity',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await VolunteerAPI.applyForOpportunity(applicationData);
      return response.data.application;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to submit application');
    }
  }
);

export const fetchApplicationsForOpportunity = createAsyncThunk(
  'volunteer/fetchApplicationsForOpportunity',
  async (opportunityId, { rejectWithValue }) => {
    try {
      const response = await VolunteerAPI.getApplicationsForOpportunity(opportunityId);
      return response.data.applications;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch applications');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'volunteer/updateApplicationStatus',
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await VolunteerAPI.updateApplicationStatus(applicationId, { status });
      return response.data.application;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update application status');
    }
  }
);

const initialState = {
  opportunities: [],
  currentOpportunity: null,
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
};

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOpportunity: (state) => {
      state.currentOpportunity = null;
    },
    clearApplications: (state) => {
      state.applications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Opportunities handling
      .addCase(fetchOpportunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        state.opportunities = action.payload;
        state.loading = false;
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOpportunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunityById.fulfilled, (state, action) => {
        state.currentOpportunity = action.payload;
        state.loading = false;
      })
      .addCase(fetchOpportunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOpportunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOpportunity.fulfilled, (state, action) => {
        state.opportunities.push(action.payload);
        state.loading = false;
      })
      .addCase(createOpportunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOpportunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOpportunity.fulfilled, (state, action) => {
        const index = state.opportunities.findIndex(opp => opp._id === action.payload._id);
        if (index !== -1) {
          state.opportunities[index] = action.payload;
        }
        state.currentOpportunity = action.payload;
        state.loading = false;
      })
      .addCase(updateOpportunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOpportunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOpportunity.fulfilled, (state, action) => {
        state.opportunities = state.opportunities.filter(opp => opp._id !== action.payload);
        if (state.currentOpportunity && state.currentOpportunity._id === action.payload) {
          state.currentOpportunity = null;
        }
        state.loading = false;
      })
      .addCase(deleteOpportunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Applications handling
      .addCase(applyForOpportunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForOpportunity.fulfilled, (state, action) => {
        state.currentApplication = action.payload;
        state.loading = false;
      })
      .addCase(applyForOpportunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchApplicationsForOpportunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationsForOpportunity.fulfilled, (state, action) => {
        state.applications = action.payload;
        state.loading = false;
      })
      .addCase(fetchApplicationsForOpportunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        state.currentApplication = action.payload;
        state.loading = false;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentOpportunity, clearApplications } = volunteerSlice.actions;

export default volunteerSlice.reducer;