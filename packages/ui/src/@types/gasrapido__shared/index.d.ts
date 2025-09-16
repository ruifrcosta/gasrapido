declare module '@gasrapido/shared' {
  import { Alert, AlertService } from '../../../../shared/src/services/alertService';
  
  export { Alert };
  export const alertService: AlertService;
}