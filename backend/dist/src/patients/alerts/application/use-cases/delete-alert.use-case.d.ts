import * as alertRepositoryInterface from '../../domain/alert.repository.interface';
export declare class DeleteAlertUseCase {
    private readonly repo;
    constructor(repo: alertRepositoryInterface.IAlertRepository);
    execute(alertId: string): Promise<void>;
}
