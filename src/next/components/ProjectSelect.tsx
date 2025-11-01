import { useConfigContext } from "@/next/contexts/ConfigContext";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export type ProjectSelectProps = {
  projectsNames: string[] | undefined;
  isLoadingProjectsNames: boolean;
};

export default function ProjectSelect({
  projectsNames,
  isLoadingProjectsNames,
}: ProjectSelectProps) {
  const { selectedProject, setSelectedProject } = useConfigContext();

  const handleSelectProjectChange = (
    event: SelectChangeEvent<string | null>,
  ) => {
    setSelectedProject(event.target.value);
  };

  const handleClearProject = () => {
    setSelectedProject(null);
  };

  const selectProjectOptions = projectsNames?.map((project) => (
    <MenuItem key={project} value={project}>
      {project}
    </MenuItem>
  ));

  return (
    <div className="select-project-container col-start-3 col-end-11 flex items-center gap-1">
      <FormControl fullWidth>
        <InputLabel id="select-project-input-label">Select Project</InputLabel>
        <Select
          labelId="select-project-input-label"
          name="project_name"
          id="select-project-input"
          value={selectedProject ?? ""}
          label="Select Project"
          onChange={handleSelectProjectChange}
        >
          {selectProjectOptions ?? (
            <MenuItem disabled value="" selected>
              {isLoadingProjectsNames
                ? "Loading projects..."
                : "Error loading projects"}
            </MenuItem>
          )}
        </Select>
      </FormControl>
      {selectedProject && (
        <IconButton
          aria-label="Clear selection"
          onClick={handleClearProject}
          size="small"
          className="mt-2"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
}
