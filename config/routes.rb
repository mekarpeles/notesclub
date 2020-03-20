Rails.application.routes.draw do
  scope :api, defaults: { format: :json} do
    devise_for :users, controllers: { sessions: :sessions },
                       path_names: { sign_in: :login }

    resources :users, only: [:show, :update]
    resources :exercises, only: [:index, :create, :show]
  end
end
