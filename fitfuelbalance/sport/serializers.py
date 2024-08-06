from rest_framework import serializers
from .models import *

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class TrainingExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    exercise_id = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all(), source='exercise', write_only=True)
    time = serializers.IntegerField(required=False, allow_null=True)
    
    class Meta:
        model = TrainingExercise
        fields = ['exercise', 'exercise_id', 'repetitions', 'sets', 'weight', 'time']

class TrainingSerializer(serializers.ModelSerializer):
    exercises_details = TrainingExerciseSerializer(source='trainingexercise_set', many=True, read_only=True)

    class Meta:
        model = Training
        fields = ['id', 'name', 'exercises_details', 'date', 'user']

    def create(self, validated_data):
        exercises_data = validated_data.pop('trainingexercise_set', [])
        user = self.context['request'].user
        if user.is_trainer:
            trainer = user.trainer
            validated_data['trainer'] = trainer
            training = Training.objects.create(**validated_data)
            for exercise_data in exercises_data:
                exercise = exercise_data.get('exercise')
                TrainingExercise.objects.create(
                    training=training, 
                    exercise=exercise, 
                    repetitions=exercise_data['repetitions'], 
                    sets=exercise_data['sets'], 
                    weight=exercise_data.get('weight'), 
                    time=exercise_data.get('time') 
                )
            return training
        else:
            raise serializers.ValidationError("El usuario no es un entrenador.")

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class WeekTrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeekTraining
        fields = '__all__'
        
class AssignedWeekTrainingSerializer(serializers.ModelSerializer):
    week_training_name = serializers.CharField(source='week_training.name', read_only=True)
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = AssignedWeekTraining
        fields = ['id', 'week_training_name', 'start_date', 'pdf_url']

    def get_pdf_url(self, obj):
        return f'/media/pdfs/Week_Training_{obj.week_training.name}.pdf'