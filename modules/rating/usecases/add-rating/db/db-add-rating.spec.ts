import { DbAddRating } from './db-add-rating';
import { AddRatingRepository } from '../../../../../bin/protocols/repositories/rating/add-rating-repository';
import { AddRatingModel } from '../add-rating';
interface SutTypes {
  sut: DbAddRating;
  addRatingStub: AddRatingRepository;
}
const makeFakeRatingData = () => ({
  ratingFor: 'any_entity',
  ratings: [{ ratingType: 'any_ratingtype', obs: 'any_rating', stars: 3 }],
});
const makeAddRatingRepository = (): AddRatingRepository => {
  class AddRatingRepositoryStub implements AddRatingRepository {
    add(ratingData: AddRatingModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddRatingRepositoryStub();
};
const makeSut = (): SutTypes => {
  const addRatingStub = makeAddRatingRepository();
  const sut = new DbAddRating(addRatingStub);
  return {
    sut,
    addRatingStub,
  };
};
describe('DbAddRating', () => {
  test('should call AddRatingRepository with correct values', async () => {
    const { sut, addRatingStub } = makeSut();
    const ratingData = makeFakeRatingData();
    const addRatingSpy = jest.spyOn(addRatingStub, 'add');
    await sut.add(ratingData);
    expect(addRatingSpy).toHaveBeenCalledWith(ratingData);
  });
  test('should throw if AddRatingRepository throws', async () => {
    const { sut, addRatingStub } = makeSut();
    const ratingData = makeFakeRatingData();
    jest
      .spyOn(addRatingStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(ratingData);
    await expect(promise).rejects.toThrow();
  });
});
