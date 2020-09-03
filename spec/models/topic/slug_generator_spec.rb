require 'rails_helper'

RSpec.describe Topic::SlugGenerator, type: :model do
  let(:topic) { Topic.new(content: 'Climate Change', user_id: 2) }

  describe 'new record' do
    describe 'ancestry=nil' do
      it 'should parametrize content' do
        generator = Topic::SlugGenerator.new(topic)
        expect(generator.generate_unique_slug).to eq('climate_change')
      end

      it 'should parametrize url' do
        topic = Topic.new(content: "https://thisurl.com/whatever")
        generator = Topic::SlugGenerator.new(topic)
        expect(generator.generate_unique_slug).to eq('https_thisurl_com_whatever')
      end

      it 'should shorten to 100 characters' do
        long_string = 'Paleoclimatology is the study of ancient climates. Since very few direct observations of climate are available before the 19th century, paleoclimates are inferred from proxy variables that include non-biotic evidence such as sediments found in lake beds and ice cores, and biotic evidence such as tree rings and coral. Climate models are mathematical models of past, present and future climates.'
        topic = Topic.new(content: long_string)
        generator = Topic::SlugGenerator.new(topic)
        expect(generator.generate_unique_slug.size <= 100).to eq(true)
      end

      context 'when slug already exists' do
        before do
          Topic.create!(content: 'Climate Change', user: topic.user)
        end

        it 'should add two random char after parametrization' do
          generator = Topic::SlugGenerator.new(topic)
          expect(SecureRandom).to receive(:urlsafe_base64).with(1).and_return('ja')
          expect(generator.generate_unique_slug).to eq('climate_changeja')
        end
      end
    end

    context 'ancestry NON nil' do
      before do
        topic.update!(ancestry: '1')
      end

      it 'should generate a random slug' do
        generator = Topic::SlugGenerator.new(topic)
        expect(SecureRandom).to receive(:urlsafe_base64).with(Topic::SlugGenerator::BYTES_NUMBER).and_return('r9qxfhmt39mgabzn0a9o')
        expect(generator.generate_unique_slug).to eq('r9qxfhmt39mgabzn0a9o')
      end

      context 'when random already exists' do
        before do
          t = Topic.create!(content: 'whatever', user: topic.user)
          t.update_column(:slug, 'r9qxfhmt39mgabzn0a9o')
        end

        it 'should generate a new one' do
          generator = Topic::SlugGenerator.new(topic)
          expect(SecureRandom).to receive(:urlsafe_base64).with(Topic::SlugGenerator::BYTES_NUMBER).once.and_return('r9qxfhmt39mgabzn0a9o')
          expect(SecureRandom).to receive(:urlsafe_base64).with(Topic::SlugGenerator::BYTES_NUMBER).once.and_return('33333333333333333333')
          expect(generator.generate_unique_slug).to eq('33333333333333333333')
        end
      end
    end
  end
end
