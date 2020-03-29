class ExercisesController < ApplicationController
  def index
    render json: Exercise.limit(100).order(id: :desc).to_json
  end

  def create
    args = params.require(:exercise).permit(:name, :data)
    args.merge!(created_by_id: current_user.id)
    exercise = Exercise.new(args)
    if exercise.save
      render :show, locals: { exercise: exercise }
    else
      render json: { errors: exercise.errors }, status: :unprocessable_entity
    end
  end

  def show
    Exercise.find(params[:id])
    render :show, locals: { exercise: exercise }
  end
end
