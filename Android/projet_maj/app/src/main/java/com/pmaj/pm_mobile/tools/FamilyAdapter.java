package com.pmaj.pm_mobile.tools;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.activities.ChatActivity;
import com.pmaj.pm_mobile.activities.LoginActivity;
import com.pmaj.pm_mobile.model.Family;

import java.util.List;

import io.socket.emitter.Emitter;


public class FamilyAdapter extends RecyclerView.Adapter<FamilyAdapter.ViewHolder> {

    private List<Family> dataset;
    private Context ActivityContext;

    private SharedPreferences mPrefs;
    // Provide a reference to the views for each data item
    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView family;
        public TextView code;

        public ViewHolder(View v) {
            super(v);
            family = v.findViewById(R.id.family);
            code = v.findViewById(R.id.code);
        }
    }

    // Provide a suitable constructor (depends on the kind of dataset)
    public FamilyAdapter(List<Family> dataset, Context ActivityContext) {

        this.dataset = dataset;
        this.ActivityContext = ActivityContext;

        mPrefs = ActivityContext.getSharedPreferences("authToken", 0);
        SharedPreferences.Editor mEditor = mPrefs.edit();
        mEditor.putString("family_name", "").apply();
        mEditor.putString("family_code", "").apply();
        mEditor.commit();


    }

    // Create new views (invoked by the layout manager)
    @Override
    public FamilyAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // create a new view
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.famille, parent, false);
        return new ViewHolder(v);
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {
        // - get element from your dataset at this position
        // - replace the contents of the view with that element

        holder.family.setText(dataset.get(position).getName());
        holder.code.setText(dataset.get(position).getCode());

        holder.family.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences.Editor mEditor = mPrefs.edit();

                final Intent intent = new Intent(ActivityContext, ChatActivity.class);
                mEditor.putString("family_name", dataset.get(position).getName()).apply();
                mEditor.putString("family_code", dataset.get(position).getCode()).apply();
                mEditor.commit();
                ActivityContext.startActivity(intent);
            }
        });

    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return dataset.size();
    }



}