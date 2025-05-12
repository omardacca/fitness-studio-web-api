interface Service {
  execute(): void;
}

class DefaultService implements Service {
  execute() {
    console.log('Executing default service...');
  }
}

class LoggingService implements Service {
  execute() {
    console.log('Executing logging service...');
  }
}

class NotificationService implements Service {
  execute() {
    console.log('Executing notification service...');
  }
}

export class ServiceFactory {
  static getService(serviceType: string): Service {
    switch (serviceType) {
      case 'logging':
        return new LoggingService();
      case 'notification':
        return new NotificationService();
      default:
        return new DefaultService();
    }
  }
}
