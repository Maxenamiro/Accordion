import { DisplayMode } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAccordeonProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext; // Обязательно
  listGuid: string;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
